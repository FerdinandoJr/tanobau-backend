// Carrega .env (precisa antes de ler process.env)
import 'dotenv/config'
import { DataSource } from 'typeorm'

import { PublicModels } from './entities'


const PublicDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  schema: 'public',
  entities: PublicModels,
  migrations: ['src/database/migrations/public/*.{ts,js}'],
  migrationsTableName: '__migrations',
  synchronize: false
})

export default PublicDataSource
