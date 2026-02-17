import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { DataSource } from "typeorm";

import { DatabaseModule } from "../database/database.module";

import { PUBLIC_DATA_SOURCE } from "database/public/public.datasource.provider";


async function main() {
  const app = await NestFactory.createApplicationContext(DatabaseModule, {
    logger: false,
  });

  const ds = app.get<DataSource>(PUBLIC_DATA_SOURCE);
  try {
    ds.setOptions({
      synchronize: false,
      migrationsRun: false,
      dropSchema: false,
      logging: false,
    });

    await ds.runMigrations();
    console.log("Public migrations applied.");
  } finally {
    if (ds.isInitialized) {
      await ds.destroy();
    }
    await app.close();
  }
}

main().catch((error) => {
  console.error("[FATAL]", error);
  process.exit(1);
});
