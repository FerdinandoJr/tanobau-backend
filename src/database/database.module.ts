import { Global, Module } from "@nestjs/common";

import { JwtModule } from "../core/security/jwt/jwt.module";

import { PUBLIC_DATA_SOURCE, PublicDataSourceProvider } from "./public/public.datasource.provider";
import { TenantConnectionManager } from "./tenant/tenant.connection.manager";
import { TENANT_DATA_SOURCE, TenantDataSourceProvider } from "./tenant/tenant.datasource.provider";


@Global()
@Module({
  imports: [JwtModule],
  providers: [PublicDataSourceProvider, TenantConnectionManager, TenantDataSourceProvider],
  exports: [PUBLIC_DATA_SOURCE, TenantConnectionManager, TENANT_DATA_SOURCE],
})
export class DatabaseModule {}
