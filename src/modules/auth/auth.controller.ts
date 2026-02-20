import { Body, Controller, HttpCode, Inject, Post } from "@nestjs/common"

import { AuthenticateDTO, LoginResponseDTO } from "./dto/login.dto"
import { RegisterUserDTO } from "./dto/register.dto"

import { AuthService } from "./auth.service"
import { Email } from "core/valueObjects"


@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private service: AuthService) { }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: AuthenticateDTO): Promise<LoginResponseDTO> {
    return await this.service.login(new Email(body.login), body.password)
  }

  @Post('register')
  async register(@Body() body: RegisterUserDTO) {
    return await this.service.register(body)
  }

}
