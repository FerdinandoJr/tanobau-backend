import { Inject, Injectable } from "@nestjs/common"
import { Brackets, DataSource, Repository } from "typeorm"
import { Paginated } from "core/valueObjects/paginated"
import { NfesUtils } from "../utils/nfes.utils"
import { INFe } from "../../domain/entities/nfe"
import { NFeModel } from "database/tenant/entities/nfe"
import { TENANT_DATA_SOURCE } from "database/tenant/tenant.datasource.provider"
import { INFeRepository, NFeFilter } from "../../domain/repositories/nfes-repository"

@Injectable()
export class NFeRepositoryImpl implements INFeRepository {
    private repo: Repository<NFeModel>

    constructor(@Inject(TENANT_DATA_SOURCE) ds: DataSource) {
        this.repo = ds.getRepository(NFeModel)
    }

    async findMany(filter: NFeFilter): Promise<Paginated<INFe>> {
        const { limit, start, q, status, uf, cnpj_emitente, data_inicio, data_fim, sortBy, sortDir } = filter
        const alias = "nfe"

        const qb = this.repo.createQueryBuilder(alias).select([
            `${alias}.id`,
            `${alias}.chaveAcesso`,
            `${alias}.cnpjEmitente`,
            `${alias}.cnpjDestinatario`,
            `${alias}.numero`,
            `${alias}.serie`,
            `${alias}.status`,
            `${alias}.protocolo`,
            `${alias}.dataEmissao`,
            `${alias}.dataAutorizacao`,
            `${alias}.capturadoEm`,
            `${alias}.atualizadoEm`,
            `${alias}.totalNota`,
            `${alias}.valorIcms`,
            `${alias}.ufDestino`
        ])

        if (q?.trim()) {
            qb.andWhere(new Brackets(or => {
                or.where(`${alias}.chaveAcesso ILIKE :q`, { q: `%${q.trim()}%` })
                    .orWhere(`${alias}.cnpjEmitente ILIKE :q`, { q: `%${q.trim()}%` })
                    .orWhere(`${alias}.cnpjDestinatario ILIKE :q`, { q: `%${q.trim()}%` })
            }))
        }

        if (status?.length) {
            qb.andWhere(`${alias}.status IN (:...status)`, { status })
        }

        if (uf?.length) {
            qb.andWhere(`${alias}.ufDestino IN (:...uf)`, { uf })
        }

        if (cnpj_emitente?.trim()) {
            qb.andWhere(`${alias}.cnpjEmitente = :cnpj_emitente`, { cnpj_emitente: cnpj_emitente.trim() })
        }

        if (data_inicio && data_fim) {
            qb.andWhere(`${alias}.dataEmissao BETWEEN :data_inicio AND :data_fim`, { data_inicio, data_fim })
        } else if (data_inicio) {
            qb.andWhere(`${alias}.dataEmissao >= :data_inicio`, { data_inicio })
        } else if (data_fim) {
            qb.andWhere(`${alias}.dataEmissao <= :data_fim`, { data_fim })
        }

        const orderField = sortBy || NfesUtils.DEFAULT_SORT
        const dir = sortDir?.toUpperCase() === "DESC" ? "DESC" : "ASC"
        qb.orderBy(`${alias}.${String(orderField)}`, dir)

        const [items, filteredTotal] = await qb
            .skip(start)
            .take(limit)
            .getManyAndCount()

        const total = await this.repo.count()

        return { total, filteredTotal, items: items.map(NfesUtils.toDomain) }
    }

    async findByChaveNFe(chave: string): Promise<INFe | null> {
        const ent = await this.repo.findOne({ where: { chaveAcesso: chave } })
        return ent ? NfesUtils.toDomain(ent) : null
    }
}
