import { Inject, Injectable } from "@nestjs/common"
import { DataSource } from "typeorm"

import { PUBLIC_DATA_SOURCE } from "database/public/public.datasource.provider"
import { IUser } from "modules/users/domain/entities/user"
import { ITenant } from "modules/tenants/domain/entities/tenant"
import { UserModel } from "database/public/entities/user"
import { TenantModel } from "database/public/entities/tenant"
import { UserTenantModel } from "database/public/entities/user-tenant"
import { UserUtils } from "modules/users/data/utils/user.utils"
import { TenantUtils } from "modules/tenants/data/utils/tenant.utils"
import { CompanyUtils } from "modules/companies/data/utils/company.utils"
import { CompanyModel } from "database/public/entities/company"

@Injectable()
export class AuthRepository {

  constructor(
    @Inject(PUBLIC_DATA_SOURCE) private publicDs: DataSource,
  ) { }

  async register(user: IUser, tenant: ITenant) {
    const qr = this.publicDs.createQueryRunner()
    await qr.connect()
    await qr.startTransaction()
    try {
      const userRepo    = qr.manager.getRepository(UserModel)
      const tenantRepo  = qr.manager.getRepository(TenantModel)
      const companyRepo = qr.manager.getRepository(CompanyModel)
      const linkRepo    = qr.manager.getRepository(UserTenantModel)

      // 1. Salva o Tenant (sem cascade automático para company)
      const tenantModel = TenantUtils.toModel(tenant) as TenantModel
      const tenantSaved = await tenantRepo.save(tenantModel)

      // 2. Salva a Company vinculada ao tenant (cascade não aplica no lado inverso)
      const companyModel = CompanyUtils.toModel({ ...tenant.company, tenantId: tenantSaved.id }) as CompanyModel
      const companySaved = await companyRepo.save(companyModel)

      // 3. Salva o User (sem FK direta para tenant)
      const userModel = UserUtils.toModel(user) as UserModel
      const userSaved = await userRepo.save(userModel)

      // 4. Cria o vínculo User ↔ Company na tabela user_tenants
      const link = linkRepo.create({ userId: userSaved.id, companyId: companySaved.id, isActive: true })
      await linkRepo.save(link)

      await qr.commitTransaction()

      return { user: UserUtils.toDomain(userSaved), tenant: TenantUtils.toDomain(tenantSaved) }
    } catch (err) {
      await qr.rollbackTransaction()
      throw err
    } finally {
      await qr.release()
    }
  }
}