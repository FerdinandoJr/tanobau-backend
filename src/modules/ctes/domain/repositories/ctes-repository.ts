import { Paginated } from "core/valueObjects/paginated"
import { ICTe } from "../entities/cte"
import { DocumentoFiscalStatus } from "core/valueObjects/documento-fiscal-status.enum"

export interface CTeFilter {
    limit: number
    start: number
    q?: string
    status?: DocumentoFiscalStatus[]
    uf?: string[]
    cnpj_emitente?: string
    data_inicio?: Date
    data_fim?: Date
    sortBy?: keyof ICTe
    sortDir?: "asc" | "desc"
}

export interface ICTeRepository {
    findMany(filter: CTeFilter): Promise<Paginated<ICTe>>
    findByChaveCTe(chave: string): Promise<ICTe | null>
}
