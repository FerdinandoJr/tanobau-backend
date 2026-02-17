import { NFeModel } from "database/tenant/entities/nfes"
import { INFe, NFe } from "modules/nfes/domain/entities/nfe"

export type NFeSortBy = typeof NfesUtils.SORTABLE_FIELDS[number]

export class NfesUtils {
    // Lista centralizada de campos permitidos para ordenação
    static readonly SORTABLE_FIELDS: readonly (keyof INFe)[] = [
        "id",
        "ch_nfe",
        "nsu",
        "uf",
        "numero_nfe",
        "data_emissao",
        "valor_total",
        "cnpj_emitente",
        "status",
        "createdAt"
    ] as const

    static readonly DEFAULT_SORT: keyof INFe = "createdAt"

    static toDomain(model: NFeModel): INFe {
        return new NFe({
            id: model.id,
            uuid: model.uuid,
            ch_nfe: model.ch_nfe,
            nsu: model.nsu,
            uf: model.uf,
            numero_nfe: model.numero_nfe,
            serie_nfe: model.serie_nfe,
            tipo_documento: model.tipo_documento,
            xml_bruto: model.xml_bruto,
            data_emissao: model.data_emissao,
            valor_total: Number(model.valor_total),
            cnpj_emitente: model.cnpj_emitente,
            nome_emitente: model.nome_emitente,
            cnpj_destinatario: model.cnpj_destinatario,
            nome_destinatario: model.nome_destinatario,
            natureza_operacao: model.natureza_operacao,
            tipo_movimentacao: model.tipo_movimentacao,
            status: model.status,
            createdAt: model.createdAt
        })
    }

    static toModel(domain: Partial<INFe>): NFeModel {
        const model = new NFeModel()

        if (domain.id) model.id = domain.id
        if (domain.uuid) model.uuid = domain.uuid

        if (domain.ch_nfe !== undefined) model.ch_nfe = domain.ch_nfe
        if (domain.nsu !== undefined) model.nsu = domain.nsu
        if (domain.uf !== undefined) model.uf = domain.uf
        if (domain.numero_nfe !== undefined) model.numero_nfe = domain.numero_nfe
        if (domain.serie_nfe !== undefined) model.serie_nfe = domain.serie_nfe
        if (domain.tipo_documento !== undefined) model.tipo_documento = domain.tipo_documento
        if (domain.xml_bruto !== undefined) model.xml_bruto = domain.xml_bruto
        if (domain.data_emissao !== undefined) model.data_emissao = domain.data_emissao
        if (domain.valor_total !== undefined) model.valor_total = domain.valor_total
        if (domain.cnpj_emitente !== undefined) model.cnpj_emitente = domain.cnpj_emitente
        if (domain.nome_emitente !== undefined) model.nome_emitente = domain.nome_emitente
        if (domain.cnpj_destinatario !== undefined) model.cnpj_destinatario = domain.cnpj_destinatario
        if (domain.nome_destinatario !== undefined) model.nome_destinatario = domain.nome_destinatario
        if (domain.natureza_operacao !== undefined) model.natureza_operacao = domain.natureza_operacao
        if (domain.tipo_movimentacao !== undefined) model.tipo_movimentacao = domain.tipo_movimentacao
        if (domain.status !== undefined) model.status = domain.status

        return model
    }
}
