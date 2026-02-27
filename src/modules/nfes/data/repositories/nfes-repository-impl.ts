import { Inject, Injectable } from "@nestjs/common"
import { Brackets, DataSource, Repository } from "typeorm"
import { Paginated } from "core/valueObjects/paginated"
import { NfesUtils } from "../utils/nfes.utils"
import { INFe } from "../../domain/entities/nfe"
import { NFeModel } from "database/tenant/entities/nfe"
import { TENANT_DATA_SOURCE } from "database/tenant/tenant.datasource.provider"
import { INFeRepository, NFeFilter } from "../../domain/repositories/nfes-repository"
import { NFeType } from "modules/nfes/domain/valueObjects/nfe-type.enum"

@Injectable()
export class NFeRepositoryImpl implements INFeRepository {
    private repo: Repository<NFeModel>

    constructor(@Inject(TENANT_DATA_SOURCE) ds: DataSource) {
        this.repo = ds.getRepository(NFeModel)
    }

    async findMany(filter: NFeFilter): Promise<Paginated<INFe>> {
        const { limit, start, type, q, status, uf, cnpj_emitente, data_inicio, data_fim, sortBy, sortDir } = filter
        const alias = "nfe"

        const qb = this.repo.createQueryBuilder(alias).select([
            `${alias}.id`,
            `${alias}.chaveAcesso`,
            `${alias}.documentoEmitente`,
            `${alias}.documentoDestinatario`,
            `${alias}.numero`,
            `${alias}.serie`,
            `${alias}.status`,
            `${alias}.protocolo`,
            `${alias}.dataEmissao`,
            `${alias}.dataAutorizacao`,
            `${alias}.totalNota`,
            `${alias}.valorIcms`,
            `${alias}.ufDestino`,
            `${alias}.capturadoEm`,
            `${alias}.atualizadoEm`
        ])


        // --- LÓGICA DE ENTRADA / SAÍDA ---
        if (type === NFeType.ENTRADA) {
            qb.andWhere(`${alias}.documentoDestinatario = :tenantCnpj`, { tenantCnpj });
        } else if (type === NFeType.SAIDA) {
            qb.andWhere(`${alias}.documentoEmitente = :tenantCnpj`, { tenantCnpj });
        }

        // Filtro Global
        if (q?.trim()) {
            const search = `%${q.trim()}%`;
            qb.andWhere(new Brackets(or => {
                or.where(`${alias}.chaveAcesso ILIKE :q`, { q: search })
                  .orWhere(`${alias}.documentoEmitente ILIKE :q`, { q: search })
                  .orWhere(`${alias}.documentoDestinatario ILIKE :q`, { q: search })
                  .orWhere(`${alias}.numero ILIKE :q`, { q: search })
            }))
        }

        // Filtros Específicos
        if (status?.length) {
            qb.andWhere(`${alias}.status IN (:...status)`, { status })
        }

        if (uf?.length) {
            qb.andWhere(`${alias}.ufDestino IN (:...uf)`, { uf })
        }

        if (cnpj_emitente?.trim()) {
            qb.andWhere(`${alias}.documentoEmitente = :cnpj_emitente`, { 
                cnpj_emitente: cnpj_emitente.trim() 
            })
        }

        // Datas
        if (data_inicio && data_fim) {
            qb.andWhere(`${alias}.dataEmissao BETWEEN :data_inicio AND :data_fim`, { data_inicio, data_fim })
        } else if (data_inicio) {
            qb.andWhere(`${alias}.dataEmissao >= :data_inicio`, { data_inicio })
        } else if (data_fim) {
            qb.andWhere(`${alias}.dataEmissao <= :data_fim`, { data_fim })
        }

        // Ordenação e Paginação
        const orderField = sortBy || 'dataEmissao'
        const dir = sortDir?.toUpperCase() === "DESC" ? "DESC" : "ASC"
        qb.orderBy(`${alias}.${orderField}`, dir)

        const take = Number(limit) || 20
        const skip = Number(start) || 0

        const [items, filteredTotal] = await qb
            .skip(skip)
            .take(take)
            .getManyAndCount()

        const total = await this.repo.count()

        return { 
            total, 
            filteredTotal, 
            items: items.map(item => NfesUtils.toDomain(item)) 
        }
    }

    async findByChaveNFe(chave: string): Promise<INFe | null> {
        const ent = await this.repo.findOne({ where: { chaveAcesso: chave } })
        return ent ? NfesUtils.toDomain(ent) : null
    }
}
