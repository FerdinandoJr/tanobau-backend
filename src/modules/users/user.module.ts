import { Module } from "@nestjs/common"


import { UserRepository } from "./data/repositories/user.repositoy.impl"
import { UserController } from "./user.controller"
import { UserService } from "./user.service"

import { JwtModule } from "core/security/jwt/jwt.module"
import { DatabaseModule } from "database/database.module"

@Module({
    imports: [DatabaseModule, JwtModule],
    providers: [UserService, UserRepository],
    exports: [UserService, UserRepository],
    controllers: [UserController],
})

export class UserModule {}
