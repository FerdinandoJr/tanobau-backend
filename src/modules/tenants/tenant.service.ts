import { BadRequestException, ConflictException, Injectable, NotFoundException, Inject } from "@nestjs/common"
import { DataSource } from "typeorm"
import { UserStatus } from "modules/users/domain/valueObjects"
import { TenantStatus } from "./domain/valueObjects/tenant-status.enum"
import { TenantRepository } from "./data/repositories/tenant.repository.impl"
import { UserRepository } from "modules/users/data/repositories/user.repositoy.impl"
import { PUBLIC_DATA_SOURCE } from "database/public/public.datasource.provider"
import { TenantConnectionManager } from "database/tenant/tenant.connection.manager"
import { AppJwtService } from "core/security/jwt/jwt.service"

@Injectable()
export class TenantService {
  constructor(
    @Inject(PUBLIC_DATA_SOURCE) private readonly publicDs: DataSource,
    @Inject(TenantRepository) private readonly repoTenant: TenantRepository,
    @Inject(UserRepository) private readonly repoUser: UserRepository,
    private readonly tenantMgr: TenantConnectionManager,
    private readonly jwt: AppJwtService,
  ) { }


  async createSchemaForUser(userUuid: string, tenantName: string) {
    // 1. Validações Iniciais
    const [tenant, user] = await Promise.all([
      this.repoTenant.findByName(tenantName),
      this.repoUser.findByUuid(userUuid)
    ])

    if (!tenant) throw new NotFoundException("Tenant Not Found")
    if (user?.status !== UserStatus.ACTIVE) throw new BadRequestException("User Not Active")
    if (tenant.status === TenantStatus.CREATE) throw new BadRequestException("Tenant already created")

    const schemaName = tenant.name

    try {
      // 2. Criação Física do Schema (DDL)
      await this.publicDs.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`)

      // 3. Marcar Início do Processo no Public (Evita concorrência)
      await this.repoTenant.update(tenant.uuid, { status: TenantStatus.INITIALIZING })

      // 4. Conexão e Migração do Tenant
      const tenantDs = await this.tenantMgr.getOrCreate(schemaName)
      await tenantDs.query(`SET search_path TO "${schemaName}", public`)
      await tenantDs.runMigrations({ transaction: "all" })

      // 5. Finalização com Sucesso
      const updatedTenant = await this.repoTenant.update(tenant.uuid, { status: TenantStatus.CREATE })

      const payload = this.jwt.createJwtPayload(user, updatedTenant)
      const tokens = await this.jwt.signTokenPair(payload)
      return tokens
    } catch (err: any) {
      // 7. Tratamento de Erro Robusto
      console.error(`Error creating tenant ${schemaName}:`, err)

      // Rollback: Se algo falhou, limpamos o schema para permitir nova tentativa
      // e voltamos o status para FAILED ou PENDING
      await this.publicDs.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`)
      await this.repoTenant.update(tenant.uuid, { status: TenantStatus.FAILED })

      if (err?.code === "42P06") throw new ConflictException("Schema already exists")
      throw err
    }
  }
}
