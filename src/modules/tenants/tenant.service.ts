import { BadRequestException, ConflictException, Injectable, NotFoundException, Inject } from "@nestjs/common"
import { DataSource } from "typeorm"
import { seedTenantData } from "./data/seed/tenant.seeds"
import { CreateTenantDTO } from "./dto/create-tenant.dto"
import { TenantModel } from "database/public/entities/tenant"
import { UserStatus } from "modules/users/domain/valueObjects"
import { TenantStatus } from "./domain/valueObjects/tenant-status.enum"
import { TenantRepository } from "./data/repositories/tenant.repository.impl"
import { UserRepository } from "modules/users/data/repositories/user.repositoy.impl"
import { PUBLIC_DATA_SOURCE } from "database/public/public.datasource.provider"
import { TenantConnectionManager } from "database/tenant/tenant.connection.manager"
import { UserModel } from "database/public/entities/user"

@Injectable()
export class TenantService {
  constructor(
    @Inject(PUBLIC_DATA_SOURCE) private readonly publicDs: DataSource,
    @Inject(TenantRepository) private readonly repoTenant: TenantRepository,
    @Inject(UserRepository) private readonly repoUser: UserRepository,
    private readonly tenantMgr: TenantConnectionManager
  ) { }

  async create(input: CreateTenantDTO) {
    const validated = input.validate()
    return await this.repoTenant.create(validated)
  }


  async createSchemaForUser(userUuid: string, tenantUuid: string) {
    // Validações
    const tenant = await this.repoTenant.findByUuid(tenantUuid)
    if (!tenant) throw new NotFoundException("Tenant Not Found")
    if (tenant.status === TenantStatus.CREATE) throw new BadRequestException("Tenant already exists")

    const user = await this.repoUser.findByUuid(userUuid)
    if (!user) throw new NotFoundException("User Not Found")
    if (user.status !== UserStatus.ACTIVE) throw new BadRequestException("User Not Active")

    // Cria schema
    const schemaName = tenant.name
    try {
      await this.publicDs.query(`CREATE SCHEMA "${schemaName}"`)
    } catch (err: any) {
      if (err?.code === "42P06") {
        throw new ConflictException("Tenant ja existe")
      }
      throw err
    }

    // Configura tenant
    const tenantDs = await this.tenantMgr.getOrCreate(schemaName)
    tenantDs.setOptions({
      schema: schemaName,
      synchronize: false,
      migrationsRun: false,
      dropSchema: false,
      logging: false,
    })

    // Inicializa tenant
    try {

      await tenantDs.query(`SET search_path TO "${schemaName}", public`)
      await tenantDs.runMigrations({ transaction: "all" })

      await seedTenantData(tenantDs, user)
    } catch (err) {
      await this.publicDs.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`)
      throw err
    }

    // Atualiza tenant e user com Transactions
    const qr = this.publicDs.createQueryRunner()
    await qr.connect()
    await qr.startTransaction()
    try {
      const tenantRepoTxn = qr.manager.getRepository(TenantModel)
      const userRepoTxn = qr.manager.getRepository(UserModel)

      await tenantRepoTxn.update({ uuid: tenant.uuid }, { status: TenantStatus.CREATE })
      await userRepoTxn.update({ uuid: user.uuid }, { status: UserStatus.ACTIVE })
      await qr.commitTransaction()

      return { ok: true }
    } catch (err: any) {
      await qr.rollbackTransaction().catch(() => { })
      throw err
    } finally {
      await qr.release().catch(() => { })
    }
  }
}
