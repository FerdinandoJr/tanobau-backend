import { INFe } from "../domain/entities/nfe"

export type NFeResponseDTO = {
    id: number
    chaveAcesso: string
    documentoEmitente: string | null
    documentoDestinatario: string | null
    numero: string
    serie: string
    status: string
    dataEmissao: Date | null
    totalNota: string | null
    valorIcms: string | null
    ufDestino: string | null
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
            id: nfe.id,
            chaveAcesso: nfe.chaveAcesso,
            documentoEmitente: nfe.documentoEmitente ?? null,
            documentoDestinatario: nfe.documentoDestinatario ?? null,
            numero: nfe.numero,
            serie: nfe.serie,
            status: nfe.status,
            dataEmissao: nfe.dataEmissao ?? null,
            totalNota: nfe.totalNota?.toString() ?? null,
            valorIcms: nfe.valorIcms?.toString() ?? null,
            ufDestino: nfe.ufDestino,
            createdAt: nfe.capturadoEm || nfe.atualizadoEm || new Date()
        }
    }
}
