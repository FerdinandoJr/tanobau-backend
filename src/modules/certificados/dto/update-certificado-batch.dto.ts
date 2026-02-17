import { Type } from "class-transformer"
import { IsArray, IsUUID, ValidateNested } from "class-validator"
import { UpdateCertificadoDTO } from "./update-certificado.dto"

class UpdateCertificadoItemDTO extends UpdateCertificadoDTO {
    @IsUUID()
    uuid!: string
}

export class UpdateCertificadoBatchDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateCertificadoItemDTO)
    items!: UpdateCertificadoItemDTO[]
}
