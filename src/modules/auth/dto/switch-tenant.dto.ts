import { TokenPair } from "core/security/jwt/jwt.types"
import { IsNotEmpty, IsString } from "class-validator"


export class SwitchCompanyDTO {
    @IsString()
    @IsNotEmpty()
    uuid!: string
}


export class SwitchTenantResponseDTO {
    token!: string
    refreshToken!: string

    static from(tokenPair: TokenPair): SwitchTenantResponseDTO {
        const dto = new SwitchTenantResponseDTO()
        dto.token = tokenPair.accessToken
        dto.refreshToken = tokenPair.refreshToken
        return dto
    }
}