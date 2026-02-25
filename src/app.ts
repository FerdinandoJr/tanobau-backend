import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { CoreModule } from "./core/core.module"
import { DatabaseModule } from "./database/database.module"
import { CertificadoModule } from "./modules/certificados/certificados.module"
import { CompanyModule } from "./modules/companies/company.module"
import { NFeModule } from "./modules/nfes/nfes.module"
import { SefazModule } from "./modules/sefaz/sefaz.module"
import { TenantModule } from "./modules/tenants/tenant.module"
import { UserModule } from "./modules/users/user.module"
import { AuthModule } from "modules/auth/auth.module"


@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CoreModule,
        DatabaseModule,
        AuthModule,
        TenantModule,
        CompanyModule,
        CertificadoModule,
        NFeModule,
        SefazModule,
    ],
})
export class AppModule { }
