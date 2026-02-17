import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Length, Min } from "class-validator"
import { uuidv7 } from "uuidv7"

import { INFe, NFe } from "../domain/entities/nfe"
import { DocumentType } from "modules/nfes/domain/valueObjects/document-type.enum"
import { DocumentStatus } from "modules/nfes/domain/valueObjects/document-status.enum"

export class CreateNFeDTO {
    @IsString()
    @Length(44, 44)
    ch_nfe!: string

    @IsString()
    nsu!: string

    @IsString()
    @Length(2, 2)
    uf!: string

    @IsNumber()
    @Min(1)
    numero_nfe!: number

    @IsNumber()
    @Min(1)
    serie_nfe!: number

    @IsOptional()
    @IsEnum(DocumentType)
    tipo_documento?: DocumentType

    @IsString()
    xml_bruto!: string

    @IsDateString()
    data_emissao!: string

    @IsNumber()
    @Min(0)
    valor_total!: number

    @IsString()
    @Length(14, 14)
    cnpj_emitente!: string

    @IsOptional()
    @IsString()
    nome_emitente?: string

    @IsOptional()
    @IsString()
    @Length(11, 14)
    cnpj_destinatario?: string

    @IsOptional()
    @IsString()
    nome_destinatario?: string

    @IsOptional()
    @IsString()
    natureza_operacao?: string

    @IsOptional()
    @IsEnum(["entrada", "saida"])
    tipo_movimentacao?: "entrada" | "saida"

    @IsOptional()
    @IsEnum(DocumentStatus)
    status?: DocumentStatus

    public validate(): INFe {
        const uuid = uuidv7()

        return new NFe({
            id: 0,
            uuid,
            ch_nfe: this.ch_nfe,
            nsu: this.nsu,
            uf: this.uf.toUpperCase(),
            numero_nfe: this.numero_nfe,
            serie_nfe: this.serie_nfe,
            tipo_documento: this.tipo_documento ?? DocumentType.NFE,
            xml_bruto: this.xml_bruto,
            data_emissao: new Date(this.data_emissao),
            valor_total: this.valor_total,
            cnpj_emitente: this.cnpj_emitente,
            nome_emitente: this.nome_emitente,
            cnpj_destinatario: this.cnpj_destinatario,
            nome_destinatario: this.nome_destinatario,
            natureza_operacao: this.natureza_operacao,
            tipo_movimentacao: this.tipo_movimentacao,
            status: this.status ?? DocumentStatus.PENDING,
            createdAt: new Date()
        })
    }
}
