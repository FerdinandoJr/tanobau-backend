import { Money } from "core/valueObjects"
import { CNPJ } from "core/valueObjects/cnpj"
import { DocumentoFiscalBase } from "core/valueObjects/documento-fiscal"
import { DocumentoFiscalStatus } from "core/valueObjects/documento-fiscal-status.enum"

export interface INFe extends DocumentoFiscalBase {
    totalNota: Money | null
    valorIcms: Money | null
    ufDestino: string | null
}

export class NFe implements INFe {
    totalNota: Money | null
    valorIcms: Money | null
    ufDestino: string | null
    
    id: number
    chaveAcesso: string
    documentoEmitente?: string | null
    documentoDestinatario?: string | null
    numero: string
    serie: string
    status: DocumentoFiscalStatus 
    protocolo: string | null
    dataEmissao: Date
    dataAutorizacao: Date | null
    xmlBruto: string | null
    capturadoEm: Date
    atualizadoEm: Date
    
    constructor(props: Partial<INFe> = {}) {
        this.totalNota = props.totalNota ?? null
        this.valorIcms = props.valorIcms ?? null
        this.ufDestino = props.ufDestino ?? null

        this.id = props.id as number
        this.chaveAcesso = props.chaveAcesso as string
        this.documentoEmitente = props.documentoEmitente ?? null
        this.documentoDestinatario = props.documentoDestinatario ?? null
        this.numero = props.numero as string
        this.serie = props.serie as string
        this.status = props.status as DocumentoFiscalStatus
        this.protocolo = props.protocolo ?? null
        this.dataEmissao = props.dataEmissao as Date
        this.dataAutorizacao = props.dataAutorizacao ?? null
        this.xmlBruto = props.xmlBruto ?? null
        this.capturadoEm = props.capturadoEm as Date
        this.atualizadoEm = props.atualizadoEm as Date
    }
}
