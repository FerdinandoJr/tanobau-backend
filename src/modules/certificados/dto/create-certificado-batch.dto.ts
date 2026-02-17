import { Type } from "class-transformer"
import { IsArray, ValidateNested } from "class-validator"
import { CreateCertificadoDTO } from "./create-certificado.dto"

export class CreateCertificadoBatchDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateCertificadoDTO)
    items!: CreateCertificadoDTO[]
}
