import { Injectable, OnModuleDestroy } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { createClient, RedisClientType } from "redis"

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: RedisClientType
  private connectPromise: Promise<void> | null = null
  private enabled: boolean

  constructor(private readonly config: ConfigService) {
    const enabledRaw = this.config.get<string>("REDIS_ENABLED") ?? "true"
    this.enabled = enabledRaw.toLowerCase() !== "false"

    const rawUrl = this.config.get<string>("REDIS_URL") ?? "redis://localhost:6379"
    let url = rawUrl.trim()
    if (
      (url.startsWith('"') && url.endsWith('"')) ||
      (url.startsWith("'") && url.endsWith("'"))
    ) {
      url = url.slice(1, -1)
    }
    if (url.startsWith("redis:") && !url.startsWith("redis://") && !url.startsWith("rediss://")) {
      url = `redis://${url.slice("redis:".length)}`
    }
    this.client = createClient({ url })
    this.client.on("error", (err) => {
      // Keep logs minimal to avoid noisy output on transient errors.
      console.error("Redis error:", err?.message ?? err)
    })
  }

  private async ensureConnected() {
    if (!this.enabled) return
    if (this.client.isOpen) return
    if (!this.connectPromise) {
      this.connectPromise = this.client.connect()
    }
    await this.connectPromise
  }

  async get(key: string): Promise<string | null> {
    if (!this.enabled) return null
    await this.ensureConnected()
    return this.client.get(key)
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (!this.enabled) return
    await this.ensureConnected()
    if (ttlSeconds && ttlSeconds > 0) {
      await this.client.set(key, value, { EX: ttlSeconds })
      return
    }
    await this.client.set(key, value)
  }

  async del(key: string): Promise<void> {
    if (!this.enabled) return
    await this.ensureConnected()
    await this.client.del(key)
  }

  async onModuleDestroy() {
    if (this.client.isOpen) {
      await this.client.quit().catch(() => { })
    }
  }
}
