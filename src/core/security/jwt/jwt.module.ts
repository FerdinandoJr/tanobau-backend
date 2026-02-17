import { Module } from '@nestjs/common'

import { JwtAuthGuard } from './jwt.guard'
import { AppJwtService } from './jwt.service'

@Module({
  providers: [AppJwtService, JwtAuthGuard],
  exports: [AppJwtService, JwtAuthGuard],
})
export class JwtModule { }
