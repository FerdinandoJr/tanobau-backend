import { CNPJ } from "core/valueObjects/cnpj"
import { CertificadoAmbiente } from "../valueObjects/certificado-ambiente.enum"

export type CertificadoId = number

/**
 * Certificado Digital domain entity.
 * Representa um certificado digital A1 usado para autenticação em serviços fiscais.
 */
export interface ICertificado {
    id: CertificadoId
    uuid: string
    binaryFile: Buffer
    passwordEncrypted: string
    cnpj: CNPJ
    companyName: string
    expirationDate: Date
    thumbprint: string
    ambiente: CertificadoAmbiente
    issuer?: string
    subject?: string
    isActive: boolean
    createdAt: Date
}

export class Certificado implements ICertificado {
    id: CertificadoId
    uuid: string
    binaryFile: Buffer
    passwordEncrypted: string
    cnpj: CNPJ
    companyName: string
    expirationDate: Date
    thumbprint: string
    ambiente: CertificadoAmbiente
    issuer?: string
    subject?: string
    isActive: boolean
    createdAt: Date

    constructor(props: ICertificado) {
        this.id = props.id
        this.uuid = props.uuid
        this.binaryFile = props.binaryFile
        this.passwordEncrypted = props.passwordEncrypted
        this.cnpj = props.cnpj
        this.companyName = props.companyName
        this.expirationDate = props.expirationDate
        this.thumbprint = props.thumbprint
        this.ambiente = props.ambiente
        this.issuer = props.issuer
        this.subject = props.subject
        this.isActive = props.isActive
        this.createdAt = props.createdAt
    }
}
