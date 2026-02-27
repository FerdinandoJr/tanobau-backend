import { CTeModel } from "database/tenant/entities/cte"
import { ICTe, CTe } from "../../domain/entities/cte"

export type CTeSortBy = typeof CtesUtils.SORTABLE_FIELDS[number]

export class CtesUtils {
    static readonly SORTABLE_FIELDS: readonly (keyof ICTe)[] = [
        "id",
        "chaveAcesso",
        "documentoEmitente",
        "documentoDestinatario",
        "numero",
        "dataEmissao",
        "valorPrestacao",
        "pesoCarga",
        "status",
    ] as const

    static readonly DEFAULT_SORT: any = "capturadoEm"

    static toDomain(model: CTeModel): ICTe {
        return new CTe({
            id: model.id,
            chaveAcesso: model.chaveAcesso,
            documentoEmitente: model.documentoEmitente,
            documentoDestinatario: model.documentoDestinatario,
            numero: model.numero,
            serie: model.serie,
            status: model.status,
            protocolo: model.protocolo,
            dataEmissao: model.dataEmissao,
            dataAutorizacao: model.dataAutorizacao,
            xmlBruto: model.xmlBruto,
            capturadoEm: model.capturadoEm,
            atualizadoEm: model.atualizadoEm,
            valorPrestacao: model.valorPrestacao,
            pesoCarga: model.pesoCarga,
            documentoRemetente: model.documentoRemetente,
            tomadorServico: model.tomadorServico
        })
    }
}

