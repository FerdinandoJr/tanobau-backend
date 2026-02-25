import { BadRequestException, Controller, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common"
import { Auth } from "core/http/decorators/auth.decorator"
import { TenantService } from "./tenant.service"
import { JwtPayload } from "core/security/jwt/jwt.types"
import { Response } from "express"

@Controller('tenants')
export class TenantController {
  constructor(private readonly service: TenantService) { }

  @Post()
  @Auth()
  @HttpCode(201)
  async create(
    @Req() req: { user: JwtPayload },
    @Res({ passthrough: true }) response: Response // O passthrough permite retornar o objeto normalmente
  ) {
    const { sub, tid } = req.user

    if (req.user.status !== 'not_create') {
      throw new BadRequestException('User already has a tenant')
    }

    const tokens = await this.service.createSchemaForUser(sub, tid)

    response.cookie('rt', tokens.refreshToken, {
      httpOnly: true,     // Impede acesso via JavaScript (XSS Protection)
      secure: false,      // Apenas via HTTPS
      sameSite: 'lax',    // Proteção contra CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em milisegundos
      path: '/',          // Disponível em toda a aplicação
    })

    return { token: tokens.accessToken }
  }
}
