import { IsString, IsBoolean, IsEnum, IsOptional, IsDateString, IsNotEmpty } from "class-validator"
import { Transform } from "class-transformer"
import { uuidv7 } from "uuidv7"

import { ICertificado, Certificado } from "../domain/entities/certificado"
import { CertificadoAmbiente } from "../domain/valueObjects/certificado-ambiente.enum"
import { CNPJ } from "core/valueObjects/cnpj"

export class CreateCertificadoDTO {

    @IsString()
    @IsNotEmpty()
    passwordEncrypted!: string

    @IsString()
    @IsNotEmpty()
    cnpj!: string

    @IsString()
    @IsNotEmpty()
    companyName!: string

    @IsDateString()
    expirationDate!: string

    @IsString()
    @IsNotEmpty()
    thumbprint!: string

    @IsEnum(CertificadoAmbiente)
    ambiente!: CertificadoAmbiente

    @IsOptional()
    @IsString()
    issuer?: string

    @IsOptional()
    @IsString()
    subject?: string


    public validate(binaryFile: Buffer): ICertificado {
        const uuid = uuidv7()

        return new Certificado({
            id: 0,
            uuid,
            binaryFile,
            passwordEncrypted: this.passwordEncrypted,
            cnpj: new CNPJ(this.cnpj),
            companyName: this.companyName,
            expirationDate: new Date(this.expirationDate),
            thumbprint: this.thumbprint,
            ambiente: this.ambiente,
            issuer: this.issuer,
            subject: this.subject,
            isPrimary: false,
            isActive: true,
            createdAt: new Date()
        })
    }
}
