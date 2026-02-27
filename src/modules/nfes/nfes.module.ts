import { Module } from "@nestjs/common"

import { NFeRepositoryImpl } from "./data/repositories/nfes-repository-impl"
import { NFesController } from "./nfes.controller"
import { NFesService } from "./nfes.services"

import { JwtModule } from "core/security/jwt/jwt.module"
import { DatabaseModule } from "database/database.module"

@Module({
    imports: [DatabaseModule, JwtModule],
    controllers: [NFesController],
    providers: [NFesService, NFeRepositoryImpl],
    exports: [NFesService],
})
export class NFeModule { }
