import { Module } from "@nestjs/common"

import { CertificadoRepository } from "./data/repositories/certificado-repository-impl"
import { CertificadoController } from "./certificados.controller"
import { CertificadoService } from "./certificados.service"

import { JwtModule } from "core/security/jwt/jwt.module"
import { DatabaseModule } from "database/database.module"

@Module({
    imports: [DatabaseModule, JwtModule],
    controllers: [CertificadoController],
    providers: [CertificadoService, CertificadoRepository],
    exports: [CertificadoService],
})
export class CertificadoModule { }
