import { Controller, HttpCode, Post, Req, UseGuards } from "@nestjs/common"

import { TenantService } from "./tenant.service"

import { CreateTenantGuard } from "core/http/guards/create-tenant.guard"
import { JwtPayloadCreateTenant } from "core/security/jwt/jwt.types"

@Controller('tenants')
export class TenantController {
  constructor(private readonly service: TenantService) { }

  @Post()
  @UseGuards(CreateTenantGuard)
  @HttpCode(201)
  async create(@Req() req: { user: JwtPayloadCreateTenant }) {
    const { sub, tid } = req.user
    await this.service.createSchemaForUser(sub, tid)
    // .then(() => console.log('Schema criado com sucesso'))
    // .catch(err => console.error('Erro ao criar schema:', err))

    return { created: true }
  }
}
