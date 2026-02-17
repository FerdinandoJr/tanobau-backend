import "dotenv/config";
import * as fs from "fs";
import * as path from "path";

import { NestFactory } from "@nestjs/core";
import { DataSource } from "typeorm";
import { camelCase } from "typeorm/util/StringUtils";

import { DatabaseModule } from "../database/database.module";

import { PUBLIC_DATA_SOURCE } from "database/public/public.datasource.provider";


function queryParams(parameters?: any[]): string {
  if (!parameters || !parameters.length) {
    return "";
  }
  return `, ${JSON.stringify(parameters)}`;
}

async function main() {
  const name: string | undefined = process.argv[2];
  if (!name) {
    console.error("Informe o nome da migration. Ex: pnpm m:g:public Init");
    process.exit(1);
  }

  const outDir = "src/database/migrations/public";
  if (!fs.existsSync(outDir)) {
    console.error(`Path '${outDir}' not exists`);
    process.exit(1);
  }

  const full = path.join(outDir, name);
  const timestamp = Date.now();
  const filename = `${timestamp}-${path.basename(full)}.ts`;
  const migrationFileName = path.join(path.dirname(full), filename);

  const app = await NestFactory.createApplicationContext(DatabaseModule, {
    logger: false,
  });

  try {
    const ds = app.get<DataSource>(PUBLIC_DATA_SOURCE);
    ds.setOptions({
      synchronize: false,
      migrationsRun: false,
      dropSchema: false,
      logging: false,
    });

    const sqlInMemory = await ds.driver.createSchemaBuilder().log();
    const upSqls: string[] = [];
    const downSqls: string[] = [];

    sqlInMemory.upQueries.forEach((upQuery) => {
      upSqls.push(
        "        await queryRunner.query(`" +
          upQuery.query.replaceAll("`", "\\`") +
          "`" +
          queryParams(upQuery.parameters) +
          ");"
      );
    });

    sqlInMemory.downQueries.forEach((downQuery) => {
      downSqls.push(
        "        await queryRunner.query(`" +
          downQuery.query.replaceAll("`", "\\`") +
          "`" +
          queryParams(downQuery.parameters) +
          ");"
      );
    });

    if (!upSqls.length) {
      console.log(
        "No changes in database schema were found - cannot generate a migration."
      );
      process.exit(1);
    }

    const migrationName = `${camelCase(path.basename(full), true)}${timestamp}`;
    const fileContent = `import { MigrationInterface, QueryRunner } from "typeorm";

export class ${migrationName} implements MigrationInterface {
    name = '${migrationName}'

    public async up(queryRunner: QueryRunner): Promise<void> {
${upSqls.join("\n")}
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
${downSqls.reverse().join("\n")}
    }

}
`;

    fs.writeFileSync(migrationFileName, fileContent, { encoding: "utf8" });
    console.log(`Migration ${migrationFileName} has been generated successfully.`);
  } finally {
    const ds = app.get<DataSource>(PUBLIC_DATA_SOURCE);
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
