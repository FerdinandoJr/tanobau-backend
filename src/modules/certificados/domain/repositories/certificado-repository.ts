import { ICertificado } from "../entities/certificado"
import { CertificadoAmbiente } from "../valueObjects/certificado-ambiente.enum"

export interface CertificadoFilter {
    limit: number
    start: number
    q?: string
    ambiente?: CertificadoAmbiente[]
    cnpj?: string
    isActive?: boolean
    isPrimary?: boolean
    expiresAfter?: Date
    expiresBefore?: Date
    sortBy?: keyof ICertificado
    sortDir?: "asc" | "desc"
}

export interface ICertificadoRepository {
    findMany(filter: CertificadoFilter): Promise<{ total: number, filteredTotal: number, items: ICertificado[] }>
    findByUuid(uuid: string): Promise<ICertificado | null>
    findByUuids(uuids: string[]): Promise<ICertificado[]>
    findByThumbprint(thumbprint: string): Promise<ICertificado | null>
    findByCnpj(cnpj: string): Promise<ICertificado[]>
    createMany(certificados: ICertificado[]): Promise<ICertificado[]>
    create(certificado: ICertificado): Promise<ICertificado>
    updateMany(certificados: ICertificado[]): Promise<ICertificado[]>
    update(uuid: string, data: Partial<ICertificado>): Promise<ICertificado>
    delete(uuid: string): Promise<void>
}
