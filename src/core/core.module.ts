import { Global, Module } from "@nestjs/common"

import { RedisService } from "./cache/redis.service"

@Global()
@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class CoreModule { }
