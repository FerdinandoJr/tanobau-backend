import { BadRequestException, Body, Controller, HttpCode, Inject, NotFoundException, Post, Req, Res, UnauthorizedException } from "@nestjs/common"

import { AuthenticateDTO, LoginResponseDTO } from "./dto/login.dto"
import { RegisterUserDTO } from "./dto/register.dto"

import { AuthService } from "./auth.service"
import { Email } from "core/valueObjects"
import { Request, Response} from "express"
import { SwitchCompanyDTO } from "./dto/switch-tenant.dto"
import { Auth } from "core/http/decorators/auth.decorator"
import { JwtPayload } from "jsonwebtoken"


@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private service: AuthService) { }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: AuthenticateDTO,
    @Res({ passthrough: true }) response: Response // O passthrough permite retornar o objeto normalmente
  ) {
    const loginData = await this.service.login(new Email(body.login), body.password)

    // 1. Configuramos o Cookie
    // refreshToken
    response.cookie('rt', loginData.refreshToken, {
      httpOnly: true,     // Impede acesso via JavaScript (XSS Protection)
      secure: false,      // Apenas via HTTPS
      sameSite: 'lax',    // Proteção contra CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias em milisegundos
      path: '/',          // Disponível em toda a aplicação
    })

    // 2. Removemos o refreshToken do objeto de retorno para ele não ir no JSON
    const { refreshToken, ...rest } = loginData
    return rest
  }


  @Post('register')
  async register(@Body() body: RegisterUserDTO) {
    return await this.service.register(body)
  }
  

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request
  ) {
    const refreshToken = req.cookies['rt']
    if (!refreshToken) throw new UnauthorizedException('Refresh token missing')

    const tokens = await this.service.refreshToken(refreshToken)

    return { token: tokens.accessToken}
  }

  @Auth()
  @Post('switch-company')
  @HttpCode(200)
  async switchCompany(
    @Body() body: SwitchCompanyDTO,
    @Req() req: { user: JwtPayload },
    @Res({ passthrough: true }) response: Response
  ) {
    const { sub } = req.user
    if (!sub) throw new NotFoundException('User not found')
    
    const tokens = await this.service.switchTenant(sub, body.uuid)

    response.cookie('rt', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    })

    return { token: tokens.token }
  } 
}
