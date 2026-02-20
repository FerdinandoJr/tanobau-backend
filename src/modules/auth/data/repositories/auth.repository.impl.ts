import { Inject, Injectable } from "@nestjs/common"
import { DataSource } from "typeorm"

import { PUBLIC_DATA_SOURCE } from "database/public/public.datasource.provider"
import { IUser } from "modules/users/domain/entities/user"
import { TenantConnectionManager } from "database/tenant/tenant.connection.manager"
import { ITenant } from "modules/tenants/domain/entities/tenant"
import { UserModel } from "database/public/entities/user"
import { TenantModel } from "database/public/entities/tenant"
import { UserUtils } from "modules/users/data/utils/user.utils"
import { TenantUtils } from "modules/tenants/data/utils/tenant.utils"


@Injectable()
export class AuthRepository {

  constructor(
    @Inject(PUBLIC_DATA_SOURCE) private publicDs: DataSource,
    @Inject(TenantConnectionManager) private tenantMgr: TenantConnectionManager
  ) { }


  async register(user: IUser, tenant: ITenant) {
    const qr = this.publicDs.createQueryRunner()
    await qr.connect()
    await qr.startTransaction()
    try {
      const userRepoTxn = qr.manager.getRepository(UserModel)
      const tenantRepoTxn = qr.manager.getRepository(TenantModel)
    
      const tenantSaved = await tenantRepoTxn.save(TenantUtils.toModel(tenant))
      
      const userModel = UserUtils.toModel(user)
      userModel.tenant = tenantSaved
      const userSaved = await userRepoTxn.save(userModel)
    
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