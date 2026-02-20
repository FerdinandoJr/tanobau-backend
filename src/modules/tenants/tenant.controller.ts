import { BadRequestException, Controller, HttpCode, Post, Req, UseGuards } from "@nestjs/common"
import { Auth } from "core/http/decorators/auth.decorator"

import { TenantService } from "./tenant.service"

import { JwtPayload } from "core/security/jwt/jwt.types"

@Controller('tenants')
export class TenantController {
  constructor(private readonly service: TenantService) { }

  @Post()
  @Auth()
  @HttpCode(201)
  async create(@Req() req: { user: JwtPayload }) {
    const { sub, tid } = req.user

    if (req.user.status !== 'not_create') {
      throw new BadRequestException('User already has a tenant')
    }

    await this.service.createSchemaForUser(sub, tid)
    // .then(() => console.log('Schema criado com sucesso'))
    // .catch(err => console.error('Erro ao criar schema:', err))

    return { created: true }
  }
}
