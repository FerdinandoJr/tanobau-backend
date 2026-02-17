import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'

import { AppJwtService } from './jwt.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: AppJwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const authHeader = request.headers.authorization || ''
    const [type, token] = authHeader.split(' ')

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Missing bearer token')
    }

    let payload
    try {
      payload = await this.jwt.verifyAccessToken(token)
    } catch (err: any) {
      if (err?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expirado')
      }
      throw new UnauthorizedException('Token invalido')
    }
    request.user = payload
    return true
  }
}
