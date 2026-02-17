import { ConfiguracaoSefazPorUF } from "database/tenant/entities/configuracao-sefaz-por-uf"
import { IConfiguracaoSefaz, ConfiguracaoSefaz } from "modules/sefaz/domain/entities/configuracao-sefaz"

export class ConfiguracaoSefazUtils {
    static toDomain(model: ConfiguracaoSefazPorUF): IConfiguracaoSefaz {
        return new ConfiguracaoSefaz({
            id: model.id,
            uuid: model.uuid,
            uf: model.uf,
            ambiente: model.ambiente,
            ultimoNSU: model.ultimo_nsu,
            maxNSU: model.max_nsu,
            ultimaConsulta: model.ultima_consulta,
            certificadoUuid: model.certificado.uuid,
            isActive: model.isActive,
            statusServico: model.status_servico,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt
        })
    }

    static toModel(domain: Partial<IConfiguracaoSefaz>): ConfiguracaoSefazPorUF {
        const model = new ConfiguracaoSefazPorUF()

        if (domain.id) model.id = domain.id
        if (domain.uuid) model.uuid = domain.uuid
        if (domain.uf !== undefined) model.uf = domain.uf
        if (domain.ambiente !== undefined) model.ambiente = domain.ambiente
        if (domain.ultimoNSU !== undefined) model.ultimo_nsu = domain.ultimoNSU
        if (domain.maxNSU !== undefined) model.max_nsu = domain.maxNSU
        if (domain.ultimaConsulta !== undefined) model.ultima_consulta = domain.ultimaConsulta
        if (domain.isActive !== undefined) model.isActive = domain.isActive
        if (domain.statusServico !== undefined) model.status_servico = domain.statusServico

        return model
    }
}
