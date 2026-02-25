import { Module } from "@nestjs/common"

import { CompanyRepository } from "./data/repositories/company.repository.impl"
import { CompanyController } from "./company.controller"
import { CompanyService } from "./company.service"

import { JwtModule } from "core/security/jwt/jwt.module"
import { DatabaseModule } from "database/database.module"

@Module({
    imports: [DatabaseModule, JwtModule],
    providers: [CompanyService, CompanyRepository],
    exports: [CompanyService, CompanyRepository],
    controllers: [CompanyController],
})
export class CompanyModule {}
