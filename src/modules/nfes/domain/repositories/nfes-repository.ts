import { Paginated } from "core/valueObjects/paginated"
import { INFe } from "../entities/nfe"
import { DocumentoFiscalStatus } from "core/valueObjects/documento-fiscal-status.enum"

export interface NFeFilter {
    limit: number
    start: number
    q?: string
    status?: DocumentoFiscalStatus[]
    uf?: string[]
    cnpj_emitente?: string
    data_inicio?: Date
    data_fim?: Date
    sortBy?: keyof INFe
    sortDir?: "asc" | "desc"
}

export interface INFeRepository {
    findMany(filter: NFeFilter): Promise<Paginated<INFe>>
    findByChaveNFe(chave: string): Promise<INFe | null>
}
