import { DocumentStatus } from "modules/nfes/domain/valueObjects/document-status.enum"
import { INFe } from "../entities/nfe"

export interface NFeFilter {
    limit: number
    start: number
    q?: string
    status?: DocumentStatus[]
    uf?: string[]
    cnpj_emitente?: string
    data_inicio?: Date
    data_fim?: Date
    sortBy?: keyof INFe
    sortDir?: "asc" | "desc"
}

export interface INFeRepository {
    findMany(filter: NFeFilter): Promise<{ total: number, filteredTotal: number, items: INFe[] }>
    findByUuid(uuid: string): Promise<INFe | null>
    findByUuids(uuids: string[]): Promise<INFe[]>
    findByChaveNFe(chave: string): Promise<INFe | null>
    createMany(nfes: INFe[]): Promise<INFe[]>
    create(nfe: INFe): Promise<INFe>
    updateMany(nfes: INFe[]): Promise<INFe[]>
    update(uuid: string, data: Partial<INFe>): Promise<INFe>
    delete(uuid: string): Promise<void>
}
