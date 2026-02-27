import { Money } from "core/valueObjects"
import { CNPJ } from "core/valueObjects/cnpj"
import { DocumentoFiscalBase } from "core/valueObjects/documento-fiscal"
import { DocumentoFiscalStatus } from "core/valueObjects/documento-fiscal-status.enum"
import { TomadorServico } from "core/valueObjects/tomador-servico.enum"

export interface ICTe extends DocumentoFiscalBase {
    valorPrestacao?: Money | null
    pesoCarga?: number | null
    documentoRemetente?: string | null
    tomadorServico?: TomadorServico | null // 0-Rem, 1-Exp, 2-Rec, 3-Dest
}

export class CTe implements ICTe {
    valorPrestacao?: Money | null
    pesoCarga?: number | null
    documentoRemetente?: string | null
    tomadorServico?: TomadorServico | null // 0-Rem, 1-Exp, 2-Rec, 3-Dest
    
    id: number
    chaveAcesso: string
    documentoEmitente?: string | null
    documentoDestinatario?: string | null
    numero: string
    serie: string
    status: DocumentoFiscalStatus // Autorizada, Cancelada, Denegada, Resumo
    protocolo?: string | null
    dataEmissao?: Date | null
    dataAutorizacao?: Date | null
    xmlBruto?: string | null// O XML original retornado pela SEFAZ
    capturadoEm: Date
    atualizadoEm: Date
    
    constructor(props: ICTe) {
        this.valorPrestacao = props.valorPrestacao
        this.pesoCarga = props.pesoCarga
        this.documentoRemetente = props.documentoRemetente
        this.tomadorServico = props.tomadorServico

        this.id = props.id
        this.chaveAcesso = props.chaveAcesso
        this.documentoEmitente = props.documentoEmitente
        this.documentoDestinatario = props.documentoDestinatario
        this.numero = props.numero
        this.serie = props.serie
        this.status = props.status
        this.protocolo = props.protocolo
        this.dataEmissao = props.dataEmissao
        this.dataAutorizacao = props.dataAutorizacao
        this.xmlBruto = props.xmlBruto
        this.capturadoEm = props.capturadoEm
        this.atualizadoEm = props.atualizadoEm
    }
}