import { DocumentStatus } from "modules/nfes/domain/valueObjects/document-status.enum"
import { DocumentType } from "modules/nfes/domain/valueObjects/document-type.enum"
import { TipoMovimentacao } from "../valueObjects/tipo-movimentacao.enum"

export type NFeId = number

/**
 * NFe (Nota Fiscal Eletrônica) domain entity.
 * Representa uma nota fiscal eletrônica com todos os seus dados.
 */
export interface INFe {
    id: NFeId
    uuid: string
    ch_nfe: string
    nsu: string
    uf: string
    numero_nfe: number
    serie_nfe: number
    tipo_documento: DocumentType
    xml_bruto?: string | null
    data_emissao: Date
    valor_total: number
    cnpj_emitente: string
    nome_emitente?: string
    cnpj_destinatario?: string
    nome_destinatario?: string
    natureza_operacao?: string
    tipo_movimentacao?: TipoMovimentacao
    status: DocumentStatus
    createdAt: Date
}

export class NFe implements INFe {
    id: NFeId
    uuid: string
    ch_nfe: string
    nsu: string
    uf: string
    numero_nfe: number
    serie_nfe: number
    tipo_documento: DocumentType
    xml_bruto?: string | null
    data_emissao: Date
    valor_total: number
    cnpj_emitente: string
    nome_emitente?: string
    cnpj_destinatario?: string
    nome_destinatario?: string
    natureza_operacao?: string
    tipo_movimentacao?: TipoMovimentacao
    status: DocumentStatus
    createdAt: Date

    constructor(props: INFe) {
        this.id = props.id
        this.uuid = props.uuid
        this.ch_nfe = props.ch_nfe
        this.nsu = props.nsu
        this.uf = props.uf
        this.numero_nfe = props.numero_nfe
        this.serie_nfe = props.serie_nfe
        this.tipo_documento = props.tipo_documento
        this.xml_bruto = props.xml_bruto
        this.data_emissao = props.data_emissao
        this.valor_total = props.valor_total
        this.cnpj_emitente = props.cnpj_emitente
        this.nome_emitente = props.nome_emitente
        this.cnpj_destinatario = props.cnpj_destinatario
        this.nome_destinatario = props.nome_destinatario
        this.natureza_operacao = props.natureza_operacao
        this.tipo_movimentacao = props.tipo_movimentacao
        this.status = props.status
        this.createdAt = props.createdAt
    }
}
