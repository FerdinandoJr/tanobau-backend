import { CertificadoModel } from "database/tenant/entities/certificados"
import { ICertificado, Certificado } from "modules/certificados/domain/entities/certificado"

export type CertificadoSortBy = typeof CertificadosUtils.SORTABLE_FIELDS[number]

export class CertificadosUtils {
    // Lista centralizada de campos permitidos para ordenação
    static readonly SORTABLE_FIELDS: readonly (keyof ICertificado)[] = [
        "id",
        "cnpj",
        "companyName",
        "expirationDate",
        "thumbprint",
        "ambiente",
        "isPrimary",
        "isActive",
        "createdAt"
    ] as const

    static readonly DEFAULT_SORT: keyof ICertificado = "createdAt"

    static toDomain(model: CertificadoModel): ICertificado {
        return new Certificado({
            id: model.id,
            uuid: model.uuid,
            binaryFile: model.binaryFile,
            passwordEncrypted: model.passwordEncrypted,
            cnpj: model.cnpj,
            companyName: model.companyName,
            expirationDate: model.expirationDate,
            thumbprint: model.thumbprint,
            ambiente: model.ambiente,
            issuer: model.issuer,
            subject: model.subject,
            isPrimary: model.isPrimary,
            isActive: model.isActive,
            createdAt: model.createdAt
        })
    }

    static toModel(domain: Partial<ICertificado>): CertificadoModel {
        const model = new CertificadoModel()

        if (domain.id) model.id = domain.id
        if (domain.uuid) model.uuid = domain.uuid

        if (domain.binaryFile !== undefined) model.binaryFile = domain.binaryFile
        if (domain.passwordEncrypted !== undefined) model.passwordEncrypted = domain.passwordEncrypted
        if (domain.cnpj !== undefined) model.cnpj = domain.cnpj
        if (domain.companyName !== undefined) model.companyName = domain.companyName
        if (domain.expirationDate !== undefined) model.expirationDate = domain.expirationDate
        if (domain.thumbprint !== undefined) model.thumbprint = domain.thumbprint
        if (domain.ambiente !== undefined) model.ambiente = domain.ambiente
        if (domain.issuer !== undefined) model.issuer = domain.issuer
        if (domain.subject !== undefined) model.subject = domain.subject
        if (domain.isPrimary !== undefined) model.isPrimary = domain.isPrimary
        if (domain.isActive !== undefined) model.isActive = domain.isActive

        return model
    }
}
