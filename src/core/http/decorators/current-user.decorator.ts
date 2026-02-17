import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtPayload } from 'jsonwebtoken'

export const CurrentUser = createParamDecorator(
    (data: keyof JwtPayload | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        const user = request.user as JwtPayload

        // Se você passar um argumento no decorator, ex: @CurrentUser('tid'), 
        // ele retorna apenas aquela propriedade.
        return data ? user?.[data] : user
    },
)