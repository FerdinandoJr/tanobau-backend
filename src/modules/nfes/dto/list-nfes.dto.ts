import { DocumentStatus } from "modules/nfes/domain/valueObjects/document-status.enum"
import { DocumentType } from "modules/nfes/domain/valueObjects/document-type.enum"
import { INFe } from "../domain/entities/nfe"

export type NFeResponseDTO = {
    uuid: string
    ch_nfe: string
    nsu: string
    uf: string
    numero_nfe: number
    serie_nfe: number
    tipo_documento: DocumentType
    data_emissao: Date
    valor_total: number
    cnpj_emitente: string
    nome_emitente?: string
    cnpj_destinatario?: string
    nome_destinatario?: string
    natureza_operacao?: string
    tipo_movimentacao?: "entrada" | "saida"
    status: DocumentStatus
    createdAt: Date
}

export type NFeListResponseDTO = {
    total: number
    filteredTotal: number
    items: NFeResponseDTO[]
}

export const NFeResponseMapper = {
    toListItem(nfe: INFe): NFeResponseDTO {
        return {
            uuid: nfe.uuid,
            ch_nfe: nfe.ch_nfe,
            nsu: nfe.nsu,
            uf: nfe.uf,
            numero_nfe: nfe.numero_nfe,
            serie_nfe: nfe.serie_nfe,
            tipo_documento: nfe.tipo_documento,
            data_emissao: nfe.data_emissao,
            valor_total: nfe.valor_total,
            cnpj_emitente: nfe.cnpj_emitente,
            nome_emitente: nfe.nome_emitente,
            cnpj_destinatario: nfe.cnpj_destinatario,
            nome_destinatario: nfe.nome_destinatario,
            natureza_operacao: nfe.natureza_operacao,
            tipo_movimentacao: nfe.tipo_movimentacao,
            status: nfe.status,
            createdAt: nfe.createdAt
        }
    }
}
