import { NFeModel } from "database/tenant/entities/nfe"
import { INFe, NFe } from "../../domain/entities/nfe"

export type NFeSortBy = typeof NfesUtils.SORTABLE_FIELDS[number]

export class NfesUtils {
    static readonly SORTABLE_FIELDS: readonly (keyof INFe)[] = [
        "id",
        "chaveAcesso",
        "cnpjEmitente",
        "cnpjDestinatario",
        "numero",
        "dataEmissao",
        "totalNota",
        "valorIcms",
        "status"
    ] as const

    static readonly DEFAULT_SORT: any = "capturadoEm"

    static toDomain(model: NFeModel): INFe {
        return new NFe({
            id: model.id,
            chaveAcesso: model.chaveAcesso,
            cnpjEmitente: model.cnpjEmitente,
            cnpjDestinatario: model.cnpjDestinatario,
            numero: model.numero,
            serie: model.serie,
            status: model.status,
            protocolo: model.protocolo,
            dataEmissao: model.dataEmissao,
            dataAutorizacao: model.dataAutorizacao,
            xmlBruto: model.xmlBruto,
            capturadoEm: model.capturadoEm,
            atualizadoEm: model.atualizadoEm,
            totalNota: model.totalNota,
            valorIcms: model.valorIcms,
            ufDestino: model.ufDestino
        })
    }

    static toModel(domain: Partial<INFe>): NFeModel {
        const model = new NFeModel()

        if (domain.id !== undefined) model.id = domain.id
        if (domain.chaveAcesso !== undefined) model.chaveAcesso = domain.chaveAcesso
        if (domain.cnpjEmitente !== undefined) model.cnpjEmitente = domain.cnpjEmitente
        if (domain.cnpjDestinatario !== undefined) model.cnpjDestinatario = domain.cnpjDestinatario
        if (domain.numero !== undefined) model.numero = domain.numero
        if (domain.serie !== undefined) model.serie = domain.serie
        if (domain.status !== undefined) model.status = domain.status
        if (domain.protocolo !== undefined) model.protocolo = domain.protocolo
        if (domain.dataEmissao !== undefined) model.dataEmissao = domain.dataEmissao
        if (domain.dataAutorizacao !== undefined) model.dataAutorizacao = domain.dataAutorizacao
        if (domain.xmlBruto !== undefined) model.xmlBruto = domain.xmlBruto
        if (domain.capturadoEm !== undefined) model.capturadoEm = domain.capturadoEm
        if (domain.atualizadoEm !== undefined) model.atualizadoEm = domain.atualizadoEm
        if (domain.totalNota !== undefined) model.totalNota = domain.totalNota
        if (domain.valorIcms !== undefined) model.valorIcms = domain.valorIcms
        if (domain.ufDestino !== undefined) model.ufDestino = domain.ufDestino

        return model
    }
}
