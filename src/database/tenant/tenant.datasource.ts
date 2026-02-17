// Carrega .env (precisa antes de ler process.env)
import 'dotenv/config'
import { DataSource } from 'typeorm'

import { TenantModels } from './entities'

const TenantDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: TenantModels,
  migrations: ['src/database/migrations/tenant/*.{ts,js}'],
  migrationsTableName: '__migrations',
  synchronize: false
})

export default TenantDataSource
