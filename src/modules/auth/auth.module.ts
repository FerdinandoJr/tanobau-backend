import { Module } from "@nestjs/common"

import { JwtModule } from "core/security/jwt/jwt.module"
import { PasswordModule } from "core/security/password/password.module"
import { DatabaseModule } from "database/database.module"
import { UserModule } from "../users/user.module"

import { AuthController } from "./auth.controller"
import { AuthRepository } from "./data/repositories/auth.repository.impl"
import { AuthService } from "./auth.service"
import { TenantModule } from "modules/tenants/tenant.module"

@Module({
    imports: [DatabaseModule, PasswordModule, UserModule, TenantModule, JwtModule],
    exports: [AuthService, AuthRepository],
    providers: [AuthService, AuthRepository],
    controllers: [AuthController]
})

export class AuthModule { }
