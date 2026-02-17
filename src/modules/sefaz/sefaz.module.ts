import { Module } from "@nestjs/common"

import { DatabaseModule } from "database/database.module"
import { JwtModule } from "core/security/jwt/jwt.module"
import { CertificadoModule } from "modules/certificados/certificados.module"
import { NFeModule } from "modules/nfes/nfes.module"

import { SefazController } from "./sefaz.controller"
import { SefazService } from "./sefaz.service"
import { NFeSyncService } from "./services/nfe-sync.service"
import { SefazClientService } from "./services/sefaz-client.service"
import { CertificadoLoaderService } from "./services/certificado-loader.service"
import { ConfiguracaoSefazRepository } from "./data/repositories/configuracao-sefaz-repository-impl"

@Module({
    imports: [
        DatabaseModule,
        JwtModule,
        CertificadoModule,
        NFeModule
    ],
    controllers: [SefazController],
    providers: [
        SefazService,
        NFeSyncService,
        SefazClientService,
        CertificadoLoaderService,
        ConfiguracaoSefazRepository
    ],
    exports: [SefazService, NFeSyncService]
})
export class SefazModule { }
