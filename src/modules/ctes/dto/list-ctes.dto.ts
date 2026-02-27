import { TomadorServico } from "core/valueObjects/tomador-servico.enum"
import { ICTe } from "../domain/entities/cte"
import { DocumentoFiscalStatus } from "core/valueObjects/documento-fiscal-status.enum"

export type CTeResponseDTO = {
    chaveAcesso: string
    documentoEmitente?: string | null
    documentoDestinatario?: string | null
    numero: string
    serie: string
    status: DocumentoFiscalStatus // Autorizada, Cancelada, Denegada, Resumo
    protocolo?: string | null
    dataEmissao?: Date | null
    valorPrestacao?: number | null
    pesoCarga?: number | null
    documentoRemetente?: string | null
    tomadorServico?: TomadorServico | null // 0-Rem, 1-Exp, 2-Rec, 3-Dest
    capturadoEm: Date
    atualizadoEm: Date
    dataAutorizacao?: Date | null
    xmlBruto?: string | null// O XML original retornado pela SEFAZ
}

export type CTeListResponseDTO = {
    total: number
    filteredTotal: number
    items: CTeResponseDTO[]
}

export const CTeResponseMapper = {
    toListItem(cte: ICTe): CTeResponseDTO {

        return {
            chaveAcesso: cte.chaveAcesso,
            documentoEmitente: cte.documentoEmitente,
            documentoDestinatario: cte.documentoDestinatario,
            numero: cte.numero,
            serie: cte.serie,
            status: cte.status,
            dataEmissao: cte.dataEmissao,
            valorPrestacao: cte.valorPrestacao?.value,
            pesoCarga: cte.pesoCarga,
            documentoRemetente: cte.documentoRemetente,
            tomadorServico: cte.tomadorServico,
            protocolo: cte.protocolo,
            capturadoEm: cte.capturadoEm,
            atualizadoEm: cte.atualizadoEm,
            dataAutorizacao: cte.dataAutorizacao,
            xmlBruto: cte.xmlBruto
        }
    }
}


