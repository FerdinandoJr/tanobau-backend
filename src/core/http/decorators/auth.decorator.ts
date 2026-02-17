import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'core/security/jwt/jwt.guard'

/**
 * Decorator para autenticação JWT.
 * 
 * Aplica o JwtAuthGuard para proteger endpoints que requerem autenticação.
 * 
 * @example
 * @Auth()
 * @Controller('products')
 * export class ProductController {
 *   @Get()
 *   async list() { }
 * }
 * 
 * @returns {MethodDecorator & ClassDecorator}
 */
export function Auth(): MethodDecorator & ClassDecorator {
  return applyDecorators(UseGuards(JwtAuthGuard))
}
