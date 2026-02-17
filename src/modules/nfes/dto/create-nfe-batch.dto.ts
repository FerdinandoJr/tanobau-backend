import { Type } from "class-transformer"
import { IsArray, ValidateNested } from "class-validator"
import { CreateNFeDTO } from "./create-nfe.dto"

export class CreateNFeBatchDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateNFeDTO)
    items!: CreateNFeDTO[]
}
