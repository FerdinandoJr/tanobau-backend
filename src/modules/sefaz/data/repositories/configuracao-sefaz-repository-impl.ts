import { Injectable, NotFoundException } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"

import { ConfiguracaoSefazPorUF } from "database/tenant/entities/configuracao-sefaz-por-uf"
import { TENANT_DATA_SOURCE } from "database/tenant/tenant.datasource.provider"
import { IConfiguracaoSefaz } from "modules/sefaz/domain/entities/configuracao-sefaz"
import { IConfiguracaoSefazRepository } from "modules/sefaz/domain/repositories/configuracao-sefaz-repository"
import { ConfiguracaoSefazUtils } from "../utils/configuracao-sefaz.utils"
import { UF } from "core/valueObjects/uf.enum"
import { Inject } from "@nestjs/common"

@Injectable()
export class ConfiguracaoSefazRepository implements IConfiguracaoSefazRepository {
    private repo: Repository<ConfiguracaoSefazPorUF>

    constructor(@Inject(TENANT_DATA_SOURCE) ds: DataSource) {
        this.repo = ds.getRepository(ConfiguracaoSefazPorUF)
    }

    async findByUF(uf: UF): Promise<IConfiguracaoSefaz | null> {
        const config = await this.repo.findOne({
            where: { uf },
            relations: ['certificado']
        })
        return config ? ConfiguracaoSefazUtils.toDomain(config) : null
    }

    async findActive(): Promise<IConfiguracaoSefaz[]> {
        const configs = await this.repo.find({
            where: { isActive: true },
            relations: ['certificado']
        })
        return configs.map(ConfiguracaoSefazUtils.toDomain)
    }

    async findByUuid(uuid: string): Promise<IConfiguracaoSefaz | null> {
        const config = await this.repo.findOne({
            where: { uuid },
            relations: ['certificado']
        })
        return config ? ConfiguracaoSefazUtils.toDomain(config) : null
    }

    async create(config: IConfiguracaoSefaz): Promise<IConfiguracaoSefaz> {
        const model = this.repo.create(ConfiguracaoSefazUtils.toModel(config))
        const saved = await this.repo.save(model)
        return ConfiguracaoSefazUtils.toDomain(saved)
    }

    async update(uuid: string, data: Partial<IConfiguracaoSefaz>): Promise<IConfiguracaoSefaz> {
        const config = await this.repo.findOne({ where: { uuid } })
        if (!config) throw new NotFoundException("Configuração SEFAZ não encontrada")

        const partialModel = ConfiguracaoSefazUtils.toModel(data)
        this.repo.merge(config, partialModel)

        const saved = await this.repo.save(config)
        return ConfiguracaoSefazUtils.toDomain(saved)
    }

    async delete(uuid: string): Promise<void> {
        const res = await this.repo.delete({ uuid })
        if (res.affected === 0) {
            throw new NotFoundException("Configuração SEFAZ não encontrada")
        }
    }
}
