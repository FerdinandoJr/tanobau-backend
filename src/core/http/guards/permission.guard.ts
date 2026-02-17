// import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata, UnauthorizedException } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";

// import { PermissionsService } from "../../security/permissions/permissions.service";

// import { Permission } from "core/valuesObjects";



// const PERMS_KEY = 'perms'
// const SCOPE_KEY = 'scope'

// export type PermissionScope = 'tenant' | 'public' | 'any'

// // Decorator to set required permissions on route handlers
// export const Perms = (...perms: Permission[]) => SetMetadata(PERMS_KEY, perms);
// export const Scope = (scope: PermissionScope) => SetMetadata(SCOPE_KEY, scope);

// @Injectable()
// export class PermissionGuard implements CanActivate {
//   constructor(
//     private readonly reflector: Reflector,
//     private readonly permissionsService: PermissionsService
//   ) {}

//     async canActivate( context: ExecutionContext): Promise<boolean> {                
//         const request = context.switchToHttp().getRequest()
//         const user = request.user
//         if (!user) throw new UnauthorizedException('Missing user (JWT guard must run first)')

//         const scope: PermissionScope = this.reflector.getAllAndOverride<PermissionScope>(SCOPE_KEY, [
//             context.getHandler(),
//             context.getClass(),
//         ]) ?? 'tenant'

//         const isDbAdmin = user?.type === 'db_admin'
//         if (scope === 'public') {
//             if (!isDbAdmin) {
//                 throw new ForbiddenException('global admin required')
//             }
//             return true
//         }

//         const required: Permission[] = this.reflector.getAllAndOverride<Permission[]>(PERMS_KEY, [
//             context.getHandler(),
//             context.getClass(),
//         ]) ?? []

//         if (scope === 'tenant' && !isDbAdmin && !user.tid && required.length > 0) {
//             throw new UnauthorizedException('Missing tenant context')
//         }

//         if (isDbAdmin) {
//             return true
//         }

//         if (required.length === 0) {
//             // No permissions required, allow access
//             return true
//         }

//         let userPerms: Permission[] = user.permissions ?? []
//         if (userPerms.length === 0) {
//             const userId = user.id ?? user.sub
//             const tid = user.tid
//             if (!userId || !tid) {
//                 throw new UnauthorizedException('Missing tenant context')
//             }
//             const rolesAndPerms = await this.permissionsService.getRolesAndPermissions(userId, tid)
//             userPerms = rolesAndPerms.permissions as Permission[]
//             user.permissions = rolesAndPerms.permissions
//             user.roles = rolesAndPerms.roles
//         }

//         const hasAllPermissions = required.every((reqPerm) =>
//             userPerms.some((userPerm) => this.matchesPermission(userPerm, reqPerm))
//         )

//         if (!hasAllPermissions) {
//             throw new ForbiddenException('Insufficient permissions');
//         }
                
//         return true
//     }


//     private matchesPermission(granted: Permission, required: Permission): boolean {
//         if (granted === "*:*") return true;

//         const [grantedRes, grantedAct] = granted.split(":")
//         const [requiredRes, requiredAct] = required.split(":")

//         const resourceMatch = grantedRes === "*" || grantedRes === requiredRes
//         const actionMatch = grantedAct === "*" || grantedAct === requiredAct

//         return resourceMatch && actionMatch
//     }


// }
