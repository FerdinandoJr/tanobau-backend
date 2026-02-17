// src/database/tenant/tenant.connection.manager.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common'
import { DataSource, EntityManager } from 'typeorm'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

import TenantDataSource from './tenant.datasource'


@Injectable()
export class TenantConnectionManager implements OnModuleDestroy {
  private readonly cache = new Map<string, DataSource>()

  async getOrCreate(schema: string): Promise<DataSource> {
    const cached = this.cache.get(schema)
    if (cached && cached.isInitialized) return cached

    const base = TenantDataSource.options as PostgresConnectionOptions
    const ds = new DataSource({
      ...base,
      name: `ten_${schema}`,
      schema,
    })

    await ds.initialize()
    this.cache.set(schema, ds)
    return ds
  }

  async onModuleDestroy() {
    for (const ds of this.cache.values()) {
      if (ds.isInitialized) {
        await ds.destroy().catch(() => void 0)
      }
    }
    this.cache.clear()
  }

  async withTxnBoth<T>(schema: string, fn: (em: EntityManager) => Promise<T>) {
    const ds = await this.getOrCreate(schema)
    const qr = ds.createQueryRunner()
    await qr.connect()
    try {
      await qr.query(`SET LOCAL search_path TO "${schema}", public`)
      await qr.startTransaction()
      const out = await fn(qr.manager)
      await qr.commitTransaction()
      return out
    } catch (e) {
      await qr.rollbackTransaction().catch(() => { })
      throw e
    } finally {
      await qr.release().catch(() => { })
    }
  }
}

