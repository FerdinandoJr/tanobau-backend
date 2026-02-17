// import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata, UnauthorizedException } from "@nestjs/common"
// import { Reflector } from "@nestjs/core"
// import { PermissionCode } from "core/valueObjects"
// import { JwtPayload } from "core/security/jwt/jwt.types"

// const PERMS_KEY = 'perms'

// /**
//  * Decorator para definir permissões necessárias em uma rota.
//  * Exemplo: @Perms('product:create', 'product:update')
//  */
// export const Perms = (...perms: PermissionCode[]) => SetMetadata(PERMS_KEY, perms)

// /**
//  * Guard que valida permissões diretamente do payload JWT.
//  * As permissões já vêm no token, não precisa buscar do banco.
//  */
// @Injectable()
// export class PermissionGuard implements CanActivate {
//     constructor(private readonly reflector: Reflector) { }

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest()
//         const user: JwtPayload = request.user

//         // Valida se o JWT Guard rodou antes
//         if (!user) {
//             throw new UnauthorizedException('Missing user (JWT guard must run first)')
//         }

//         // Busca as permissões requeridas pelo decorator @Perms()
//         const required: PermissionCode[] = this.reflector.getAllAndOverride<PermissionCode[]>(PERMS_KEY, [
//             context.getHandler(),
//             context.getClass(),
//         ]) ?? []

//         // Se não há permissões requeridas, permite acesso
//         if (required.length === 0) {
//             return true
//         }

//         // Admin global tem acesso total
//         if (user.type === 'admin') {
//             return true
//         }

//         // Valida contexto de tenant
//         if (!user.tid) {
//             throw new UnauthorizedException('Missing tenant context')
//         }

//         // Busca permissões do usuário do payload JWT
//         const userPerms: PermissionCode[] = user.permissions ?? []

//         // Verifica se o usuário tem todas as permissões requeridas
//         const hasAllPermissions = required.every((reqPerm) =>
//             userPerms.some((userPerm) => this.matchesPermission(userPerm, reqPerm))
//         )

//         if (!hasAllPermissions) {
//             throw new ForbiddenException('Insufficient permissions')
//         }

//         return true
//     }

//     /**
//      * Verifica se uma permissão concedida corresponde a uma permissão requerida.
//      * Suporta wildcards (*) para recursos e ações.
//      *
//      * Exemplos:
//      * - "*:*" concede acesso a tudo
//      * - "product:*" concede todas as ações em product
//      * - "*:create" concede create em todos os recursos
//      */
//     private matchesPermission(granted: PermissionCode, required: PermissionCode): boolean {
//         if (granted === "*:*") return true

//         const [grantedRes, grantedAct] = granted.split(":")
//         const [requiredRes, requiredAct] = required.split(":")

//         const resourceMatch = grantedRes === "*" || grantedRes === requiredRes
//         const actionMatch = grantedAct === "*" || grantedAct === requiredAct

//         return resourceMatch && actionMatch
//     }
// }
