import { ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common"
import { AppJwtService } from "core/security/jwt/jwt.service"
import { PasswordHasher } from "core/security/password/password-hasher"
import { Email } from "core/valueObjects"
import { PUBLIC_DATA_SOURCE } from "database/public/public.datasource.provider"
import { TenantRepository } from "modules/tenants/data/repositories/tenant.repository.impl"
import { UserRepository } from "modules/users/data/repositories/user.repositoy.impl"
import { UserStatus, UserType } from "modules/users/domain/valueObjects"
import { DataSource } from "typeorm"
import { RegisterUserDTO } from "./dto/register.dto"
import { AuthRepository } from "./data/repositories/auth.repository.impl"
import { LoginResponseDTO } from "./dto/login.dto"
import { TenantStatus } from "modules/tenants/domain/valueObjects/tenant-status.enum"
import { User } from "modules/users/domain/entities/user"
import { uuidv7 } from "uuidv7"
import { Tenant } from "modules/tenants/domain/entities/tenant"
import { env } from "process"
import { SwitchTenantResponseDTO } from "./dto/switch-tenant.dto"

@Injectable()
export class AuthService {
    constructor(
        @Inject('PasswordHasher') private readonly hasher: PasswordHasher,
        @Inject(PUBLIC_DATA_SOURCE) private readonly publicDs: DataSource,
        @Inject(UserRepository) private readonly userRepo: UserRepository,
        @Inject(TenantRepository) private readonly tenantRepo: TenantRepository,
        private readonly jwt: AppJwtService,
        private readonly authRepository: AuthRepository
    ) { }


    async login(email: Email, password: string): Promise<LoginResponseDTO> {
        const user = await this.userRepo.findByEmail(email)
        if (!user) throw new NotFoundException("User not found")

        if (user.status === UserStatus.UNVERIFIED) throw new UnauthorizedException("User Not Verified")
        if (user.status === UserStatus.SUSPENDED) throw new UnauthorizedException("User Suspended")

        const ok = await this.hasher.compare(password, user.password)
        if (!ok) throw new UnauthorizedException("Invalid password")

        const firstCompany = user.companies[0] ?? null
        if (!firstCompany) throw new ForbiddenException('No company linked to this user')

        const tenant = await this.tenantRepo.findById(firstCompany.tenantId)
        if (!tenant) throw new ForbiddenException('Invalid tenant')

        const payload = this.jwt.createJwtPayload(user, tenant)
        const tokens = await this.jwt.signTokenPair(payload)
        return LoginResponseDTO.from({
            user,
            tokenPair: tokens,
            companies: user.companies
        })
    }

    async register(input: RegisterUserDTO) {
        const user = input.user.validate()
        const company = input.company.validate()

        const userExists = await this.userRepo.findByEmail(user.email)
        if (userExists) throw new UnauthorizedException("Email already exists")

        const suffix = company.cnpj.value
        const tenantName = `ten_${suffix}`
        const tenantExists = await this.tenantRepo.findByName(tenantName)
        if (tenantExists) throw new UnauthorizedException("Tenant already exists")

        const tenant = new Tenant({
            id: 0,
            uuid: uuidv7(),
            name: tenantName,
            apiVersion: env.API_VERSION || "v1",
            status: TenantStatus.NOT_CREATE,
            createdAt: new Date(),            
            company,
            isActive: true,
        })

        const passwordHash = await this.hasher.hash(user.password)
        const newUser = new User({
            ...user,
            password: passwordHash,
            status: UserStatus.ACTIVE,
            type: UserType.ACCOUNTANT,
            createdAt: new Date(),
            companies: [],
        })

        await this.authRepository.register(newUser, tenant)
        return { registered: true }
    }


    async refreshToken(refreshToken: string) {
        const decoded = await this.jwt.verifyRefreshToken(refreshToken)

        const user = await this.userRepo.findByUuid(decoded.sub)
        if (!user) throw new UnauthorizedException("User not found")

        if (user.status === UserStatus.UNVERIFIED) throw new UnauthorizedException("User Not Verified")
        if (user.status === UserStatus.SUSPENDED) throw new UnauthorizedException("User Suspended")

        if (!decoded.tid) throw new UnauthorizedException("Tenant not found")

        return await this.jwt.signTokenPair(decoded)
    }

    async switchTenant(userUuid: string, companyUuid: string) {
        const user = await this.userRepo.findByUuid(userUuid)
        if (!user) throw new UnauthorizedException("User not found")

        if (user.status === UserStatus.UNVERIFIED) throw new UnauthorizedException("User Not Verified")
        if (user.status === UserStatus.SUSPENDED) throw new UnauthorizedException("User Suspended")

        // Verifica se o user tem acesso à company solicitada
        // (user.companies já vem carregado pelo findByUuid via userTenants)
        const targetCompany = user.companies.find(c => c.uuid === companyUuid)
        if (!targetCompany) throw new ForbiddenException("Access denied to this company")

        // Resolve o tenant pelo tenantId da company
        const tenant = await this.tenantRepo.findById(targetCompany.tenantId)
        if (!tenant) throw new UnauthorizedException("Tenant not found")

        const payload = this.jwt.createJwtPayload(user, tenant)
        const tokens = await this.jwt.signTokenPair(payload)
        return SwitchTenantResponseDTO.from(tokens)
    }
}
