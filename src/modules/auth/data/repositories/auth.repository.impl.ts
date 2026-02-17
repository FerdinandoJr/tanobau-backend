import { Inject, Injectable } from "@nestjs/common"
import { DataSource } from "typeorm"

import { PUBLIC_DATA_SOURCE } from "database/public/public.datasource.provider"
import { IAuthRepository } from "modules/auth/domain/repositories/auth.repository"
import { IUser } from "modules/users/domain/entities/user"
import { TenantConnectionManager } from "database/tenant/tenant.connection.manager"
import { EmployeeModel } from "database/tenant/entities/employee"
import { ITenant } from "modules/tenants/domain/entities/tenant"
import { UserModel } from "database/public/entities/user"
import { TenantModel } from "database/public/entities/tenant"
import { EmailVerificationModel } from "database/public/entities/email-verification"
import { UserUtils } from "modules/users/data/utils/user.utils"
import { TenantUtils } from "modules/tenants/data/utils/tenant.utils"
import { UserStatus } from "modules/users/domain/valueObjects"
import { IEmployee } from "modules/employees/domain/entities/employee"
import { EmployeeUtils } from "modules/employees/data/utils/employee.utils"
import { Email } from "core/valueObjects"
import { UserTenantModel } from "database/public/entities/user-tenant"

@Injectable()
export class AuthRepository implements IAuthRepository {

  constructor(
    @Inject(PUBLIC_DATA_SOURCE) private publicDs: DataSource,
    @Inject(TenantConnectionManager) private tenantMgr: TenantConnectionManager
  ) { }


  async getEmployee(schemaName: string, user: IUser): Promise<IEmployee | null> {
    const tenantDs = await this.tenantMgr.getOrCreate(schemaName)

    const employeeRepo = tenantDs.getRepository(EmployeeModel)
    const employee = await employeeRepo.findOne({
      where: { userId: user.id },
      relations: [
        // 1. Carregar Cargos (Roles)
        "employeeRoles",
        "employeeRoles.role",

        // 2. Carregar Permissões DENTRO dos Cargos
        // Se Role tiver tabela intermediária "rolePermissions", o caminho é longo:
        "employeeRoles.role.rolePermissions", 
        "employeeRoles.role.rolePermissions.permission", 
        
        // 3. Carregar Permissões DIRETAS do Funcionário
        // Atenção: O nome na entidade EmployeeModel é 'employeePermissions'
        "employeePermissions",
        "employeePermissions.permission",

        // 4. Carregar Empresas
        // Atenção: O nome na entidade EmployeeModel é 'employeeCompanies'
        "employeeCompanies",
        "employeeCompanies.company"
      ]
    })

    console.log(employee?.employeeRoles)

    return employee ? EmployeeUtils.toDomain(employee) : null
  }

  async register(user: IUser, tenant: ITenant) {
    const qr = this.publicDs.createQueryRunner()
    await qr.connect()
    await qr.startTransaction()
    try {
      const userRepoTxn = qr.manager.getRepository(UserModel)
      const tenantRepoTxn = qr.manager.getRepository(TenantModel)
      const userTenantRepoTxn = qr.manager.getRepository(UserTenantModel)
      const emailVerificationRepoTxn = qr.manager.getRepository(EmailVerificationModel)

      const userSaved = await userRepoTxn.save(UserUtils.toModel(user))
      const tenantSaved = await tenantRepoTxn.save(TenantUtils.toModel(tenant))

      const userTenant = new UserTenantModel()
      userTenant.user = userSaved
      userTenant.tenant = tenantSaved
      await userTenantRepoTxn.save(userTenant)

      await emailVerificationRepoTxn.save({
        email: user.email,
        code: user.generateVerificationCode(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
      })

      await qr.commitTransaction()

      return { registered: true }
    } catch (err) {
      await qr.rollbackTransaction()
      throw err
    } finally {
      await qr.release()
    }
  }

  async verifyEmail(user: IUser, verificationId: number): Promise<boolean> {
    const qr = this.publicDs.createQueryRunner()
    await qr.connect()
    await qr.startTransaction()
    try {
      const userRepoTxn = qr.manager.getRepository(UserModel)
      const emailVerificationRepoTxn = qr.manager.getRepository(EmailVerificationModel)

      user.status = UserStatus.ACTIVE
      await userRepoTxn.save(UserUtils.toModel(user))
      await emailVerificationRepoTxn.update(verificationId, { usedAt: new Date() })
      await qr.commitTransaction()

      return true
    } catch (err) {
      await qr.rollbackTransaction().catch(() => { })
      throw err
    } finally {
      await qr.release().catch(() => { })
    }
  }

  async resendVerificationEmail(verificationid: number, user: IUser, expiresAt: Date) {
    const emailVerificationRepoTxn = this.publicDs.getRepository(EmailVerificationModel)
    await emailVerificationRepoTxn.save({
      id: verificationid,
      code: user.generateVerificationCode(),
      expiresAt
    })
  }

  async getEmailVerification(email: Email) {
    const emailVerificationRepoTxn = this.publicDs.getRepository(EmailVerificationModel)
    const verification = await emailVerificationRepoTxn.findOne({ where: { email } })
    return verification
  }
}