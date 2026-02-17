import { Type } from "class-transformer"
import { IsArray, IsUUID, ValidateNested } from "class-validator"
import { UpdateNFeDTO } from "./update-nfe.dto"

class UpdateNFeItemDTO extends UpdateNFeDTO {
    @IsUUID()
    uuid!: string
}

export class UpdateNFeBatchDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateNFeItemDTO)
    items!: UpdateNFeItemDTO[]
}
