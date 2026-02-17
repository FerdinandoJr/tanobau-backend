import { CNPJ } from "core/valueObjects/cnpj"
import { CertificadoAmbiente } from "../domain/valueObjects/certificado-ambiente.enum"
import { ICertificado } from "../domain/entities/certificado"

export type CertificadoResponseDTO = {
    uuid: string
    cnpj: CNPJ
    companyName: string
    expirationDate: Date
    thumbprint: string
    ambiente: CertificadoAmbiente
    issuer?: string
    subject?: string
    isPrimary: boolean
    isActive: boolean
    createdAt: Date
}

export type CertificadoListResponseDTO = {
    total: number
    filteredTotal: number
    items: CertificadoResponseDTO[]
}

export const CertificadoResponseMapper = {
    toListItem(cert: ICertificado): CertificadoResponseDTO {
        return {
            uuid: cert.uuid,
            cnpj: cert.cnpj,
            companyName: cert.companyName,
            expirationDate: cert.expirationDate,
            thumbprint: cert.thumbprint,
            ambiente: cert.ambiente,
            issuer: cert.issuer,
            subject: cert.subject,
            isPrimary: cert.isPrimary,
            isActive: cert.isActive,
            createdAt: cert.createdAt
        }
    }
}
