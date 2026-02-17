import { Module } from "@nestjs/common"

import { NFeRepository } from "./data/repositories/nfe-repository-impl"
import { NFeController } from "./nfes.controller"
import { NFeService } from "./nfes.service"

import { JwtModule } from "core/security/jwt/jwt.module"
import { DatabaseModule } from "database/database.module"

@Module({
    imports: [DatabaseModule, JwtModule],
    controllers: [NFeController],
    providers: [NFeService, NFeRepository],
    exports: [NFeService],
})
export class NFeModule { }
