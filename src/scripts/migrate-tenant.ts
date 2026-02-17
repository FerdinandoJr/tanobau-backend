import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { DataSource } from "typeorm";

import { DatabaseModule } from "../database/database.module";
import { TenantConnectionManager } from "../database/tenant/tenant.connection.manager";

async function main() {
  const schema: string = process.argv[2] || process.env.TENANT_SCHEMA || "ten_default";

  const app = await NestFactory.createApplicationContext(DatabaseModule, {
    logger: false,
  });

  const mgr = app.get(TenantConnectionManager);
  let ds: DataSource | undefined;
  try {
    ds = await mgr.getOrCreate(schema);
    ds.setOptions({
      schema,
      synchronize: false,
      migrationsRun: false,
      dropSchema: false,
      logging: false,
    });

    await ds.query(`SET search_path TO "${schema}", public`);
    await ds.runMigrations();
    console.log(`Tenant migrations applied for ${schema}.`);
  } finally {
    if (ds?.isInitialized) {
      await ds.destroy();
    }
    await app.close();
  }
}

main().catch((error) => {
  console.error("[FATAL]", error);
  process.exit(1);
});
