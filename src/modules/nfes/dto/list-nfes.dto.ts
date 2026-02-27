import { DocumentoFiscalStatus } from "core/valueObjects/documento-fiscal-status.enum"
import { INFe } from "../domain/entities/nfe"

export type NFeResponseDTO = {
    chaveAcesso: string
    documentoEmitente?: string | null
    documentoDestinatario?: string | null
    numero: string
    serie: string
    status: DocumentoFiscalStatus
    protocolo?: string | null
    dataEmissao?: Date | null
    dataAutorizacao?: Date | null
    xmlBruto?: string | null
    capturadoEm: Date
    atualizadoEm: Date
    totalNota?: number | null
    valorIcms?: number | null
    ufDestino?: string | null
}

export type NFeListResponseDTO = {
    total: number
    filteredTotal: number
    items: NFeResponseDTO[]
}

export const NFeResponseMapper = {
    toDto(nfe: INFe): NFeResponseDTO {
        return {
            chaveAcesso: nfe.chaveAcesso,
            documentoEmitente: nfe.documentoEmitente ?? null,
            documentoDestinatario: nfe.documentoDestinatario ?? null,
            numero: nfe.numero,
            serie: nfe.serie,
            status: nfe.status,
            dataEmissao: nfe.dataEmissao ?? null,
            totalNota: nfe.totalNota?.value ?? null,
            valorIcms: nfe.valorIcms?.value ?? null,
            ufDestino: nfe.ufDestino,
            capturadoEm: nfe.capturadoEm,
            atualizadoEm: nfe.atualizadoEm,
            dataAutorizacao: nfe.dataAutorizacao,
            xmlBruto: nfe.xmlBruto
        }
    }
}
