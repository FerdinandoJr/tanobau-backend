import { IsEnum } from "class-validator"
import { UF } from "core/valueObjects/uf.enum"

export class SyncNFeDTO {
    @IsEnum(UF)
    uf!: UF
}
