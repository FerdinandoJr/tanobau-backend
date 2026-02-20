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

        const tenant = user.tenant ?? null
        if (!tenant) throw new ForbiddenException('Invalid tenant')

        const payload = this.jwt.createJwtPayload(user, tenant)
        const tokens = await this.jwt.signTokenPair(payload)
        return LoginResponseDTO.from({
            user,
            tokenPair: tokens
        })
    }

    async register(input: RegisterUserDTO) {
        const user = input.user.validate()
        const uuid = uuidv7()
        const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`
        const tenantName = `ten_${suffix}`
        const tenant = new Tenant({
            id: 0,
            uuid: uuid,
            name: tenantName,
            apiVersion: env.API_VERSION || "v1",
            status: TenantStatus.NOT_CREATE,
            createdAt: new Date(),
            isActive: true
        })

        const userExists = await this.userRepo.findByEmail(user.email)
        if (userExists) throw new UnauthorizedException("Email already exists")

        const tenantExists = await this.tenantRepo.findByName(tenant.name)
        if (tenantExists) throw new UnauthorizedException("Tenant already exists")

        const passwordHash = await this.hasher.hash(user.password)
        const newUser = new User({
            ...user,
            password: passwordHash,
            status: UserStatus.ACTIVE,
            type: UserType.USER,
            createdAt: new Date()
        })

        const { user: userSaved, tenant: tenantSaved } = await this.authRepository.register(newUser, tenant)

        const payload = this.jwt.createJwtPayload(userSaved, tenantSaved)
        const tokens = await this.jwt.signTokenPair(payload)
        return LoginResponseDTO.from({
            user: userSaved,
            tokenPair: tokens
        })
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
}
