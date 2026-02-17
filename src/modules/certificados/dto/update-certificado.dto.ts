import { IsString, IsBoolean, IsEnum, IsOptional, IsDateString, IsNotEmpty } from "class-validator"

import { ICertificado } from "../domain/entities/certificado"
import { CertificadoAmbiente } from "../domain/valueObjects/certificado-ambiente.enum"
import { CNPJ } from "core/valueObjects/cnpj"

export class UpdateCertificadoDTO {
    @IsOptional()
    binaryFile?: Buffer

    @IsOptional()
    @IsString()
    passwordEncrypted?: string

    @IsOptional()
    @IsString()
    companyName?: string

    @IsOptional()
    @IsDateString()
    expirationDate?: string

    @IsOptional()
    @IsEnum(CertificadoAmbiente)
    ambiente?: CertificadoAmbiente

    @IsOptional()
    @IsString()
    issuer?: string

    @IsOptional()
    @IsString()
    subject?: string

    @IsOptional()
    @IsBoolean()
    isPrimary?: boolean

    @IsOptional()
    @IsBoolean()
    isActive?: boolean

    public validate(): Partial<ICertificado> {
        const data: Partial<ICertificado> = {}

        if (this.binaryFile !== undefined) data.binaryFile = this.binaryFile
        if (this.passwordEncrypted !== undefined) data.passwordEncrypted = this.passwordEncrypted
        if (this.companyName !== undefined) data.companyName = this.companyName
        if (this.expirationDate !== undefined) data.expirationDate = new Date(this.expirationDate)
        if (this.ambiente !== undefined) data.ambiente = this.ambiente
        if (this.issuer !== undefined) data.issuer = this.issuer
        if (this.subject !== undefined) data.subject = this.subject
        if (this.isPrimary !== undefined) data.isPrimary = this.isPrimary
        if (this.isActive !== undefined) data.isActive = this.isActive

        if (Object.keys(data).length === 0) {
            throw new Error("Pelo menos um campo deve ser fornecido para atualização.")
        }

        return data
    }
}
