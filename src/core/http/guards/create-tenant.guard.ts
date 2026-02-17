import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { AppJwtService } from "core/security/jwt/jwt.service"

@Injectable()
export class CreateTenantGuard implements CanActivate {
    constructor(private readonly jwt: AppJwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)

        try {
            const payload = await this.jwt.verifyCreateTenantToken(token)

            if (payload.type !== 'create_tenant_token') {
                throw new UnauthorizedException('Token inválido para esta operação')
            }

            request.user = payload
            return true
        } catch (err) {
            if (err instanceof UnauthorizedException) throw err
            throw new UnauthorizedException('Token de criação expirado ou inválido')
        }
    }

    private extractTokenFromHeader(request: any): string {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : ''
    }
}