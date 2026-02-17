import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, Length, Min } from "class-validator"

import { INFe } from "../domain/entities/nfe"
import { DocumentType } from "modules/nfes/domain/valueObjects/document-type.enum"
import { DocumentStatus } from "modules/nfes/domain/valueObjects/document-status.enum"

export class UpdateNFeDTO {
    @IsOptional()
    @IsString()
    xml_bruto?: string

    @IsOptional()
    @IsEnum(DocumentStatus)
    status?: DocumentStatus

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
    @IsNumber()
    @Min(0)
    valor_total?: number

    @IsOptional()
    @IsDateString()
    data_emissao?: string

    public validate(): Partial<INFe> {
        const data: Partial<INFe> = {}

        if (this.xml_bruto !== undefined) data.xml_bruto = this.xml_bruto
        if (this.status !== undefined) data.status = this.status
        if (this.nome_emitente !== undefined) data.nome_emitente = this.nome_emitente
        if (this.cnpj_destinatario !== undefined) data.cnpj_destinatario = this.cnpj_destinatario
        if (this.nome_destinatario !== undefined) data.nome_destinatario = this.nome_destinatario
        if (this.natureza_operacao !== undefined) data.natureza_operacao = this.natureza_operacao
        if (this.tipo_movimentacao !== undefined) data.tipo_movimentacao = this.tipo_movimentacao
        if (this.valor_total !== undefined) data.valor_total = this.valor_total
        if (this.data_emissao !== undefined) data.data_emissao = new Date(this.data_emissao)

        if (Object.keys(data).length === 0) {
            throw new Error("Pelo menos um campo deve ser fornecido para atualização.")
        }

        return data
    }
}
