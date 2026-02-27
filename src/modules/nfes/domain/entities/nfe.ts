import { Money } from "core/valueObjects"
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
    documentoEmitente?: string | null | undefined
    documentoDestinatario?: string | null | undefined
    numero: string
    serie: string
    status: DocumentoFiscalStatus
    protocolo?: string | null | undefined
    dataEmissao?: Date | null | undefined
    dataAutorizacao?: Date | null | undefined
    xmlBruto?: string | null | undefined
    capturadoEm: Date
    atualizadoEm: Date

    constructor(props: INFe) {
        this.totalNota = props.totalNota ?? null
        this.valorIcms = props.valorIcms ?? null
        this.ufDestino = props.ufDestino ?? null

        this.id = props.id
        this.chaveAcesso = props.chaveAcesso
        this.documentoEmitente = props.documentoEmitente ?? null
        this.documentoDestinatario = props.documentoDestinatario ?? null
        this.numero = props.numero
        this.serie = props.serie
        this.status = props.status
        this.protocolo = props.protocolo ?? null
        this.dataEmissao = props.dataEmissao
        this.dataAutorizacao = props.dataAutorizacao ?? null
        this.xmlBruto = props.xmlBruto ?? null
        this.capturadoEm = props.capturadoEm
        this.atualizadoEm = props.atualizadoEm
    }

}
