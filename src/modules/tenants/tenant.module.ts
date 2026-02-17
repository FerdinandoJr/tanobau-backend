import { Module } from "@nestjs/common"

import { TenantController } from "./tenant.controller"
import { TenantService } from "./tenant.service"

import { JwtModule } from "core/security/jwt/jwt.module"
import { DatabaseModule } from "database/database.module"
import { UserRepository } from "modules/users/data/repositories/user.repositoy.impl"
import { TenantRepository } from "./data/repositories/tenant.repository.impl"

@Module({
  imports: [DatabaseModule, JwtModule],
  providers: [UserRepository, TenantService, TenantRepository],
  controllers: [TenantController],
  exports: [TenantService, TenantRepository],
})

export class TenantModule { }