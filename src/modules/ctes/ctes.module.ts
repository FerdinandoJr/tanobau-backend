import { Module } from "@nestjs/common"

import { CTeRepositoryImpl } from "./data/repositories/ctes-repository-impl"
import { CTesController } from "./ctes.controller"
import { CTesService } from "./ctes.services"

import { JwtModule } from "core/security/jwt/jwt.module"
import { DatabaseModule } from "database/database.module"

@Module({
    imports: [DatabaseModule, JwtModule],
    controllers: [CTesController],
    providers: [CTesService, CTeRepositoryImpl],
    exports: [CTesService],
})
export class CTesModule { }
