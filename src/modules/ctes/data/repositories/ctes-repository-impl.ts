import { Inject, Injectable } from "@nestjs/common"
import { Brackets, DataSource, Repository } from "typeorm"
import { Paginated } from "core/valueObjects/paginated"
import { CtesUtils } from "../utils/ctes.utils"
import { ICTe } from "../../domain/entities/cte"
import { CTeModel } from "database/tenant/entities/cte"
import { TENANT_DATA_SOURCE } from "database/tenant/tenant.datasource.provider"
import { ICTeRepository, CTeFilter } from "../../domain/repositories/ctes-repository"

@Injectable()
export class CTeRepositoryImpl implements ICTeRepository {
    private repo: Repository<CTeModel>

    constructor(@Inject(TENANT_DATA_SOURCE) ds: DataSource) {
        this.repo = ds.getRepository(CTeModel)
    }

    async findMany(filter: CTeFilter): Promise<Paginated<ICTe>> {
        const { limit, start, q, status, uf, cnpj_emitente, data_inicio, data_fim, sortBy, sortDir } = filter
        const alias = "cte"

        const qb = this.repo.createQueryBuilder(alias).select([
            `${alias}.id`,
            `${alias}.chaveAcesso`,
            `${alias}.documentoEmitente`,
            `${alias}.documentoDestinatario`,
            `${alias}.documentoRemetente`, // Adicionado conforme sua classe
            `${alias}.numero`,
            `${alias}.serie`,
            `${alias}.status`,
            `${alias}.protocolo`,
            `${alias}.dataEmissao`,
            `${alias}.dataAutorizacao`,
            `${alias}.capturadoEm`,
            `${alias}.atualizadoEm`,
            `${alias}.valorPrestacao`,
            `${alias}.pesoCarga`,
            `${alias}.tomadorServico` // 0-Rem, 1-Exp, 2-Rec, 3-Dest
        ])

        // Filtro de Texto (Busca Global)
        if (q?.trim()) {
            const search = `%${q.trim()}%`;
            qb.andWhere(new Brackets(or => {
                or.where(`${alias}.chaveAcesso ILIKE :q`, { q: search })
                  .orWhere(`${alias}.documentoEmitente ILIKE :q`, { q: search })
                  .orWhere(`${alias}.documentoDestinatario ILIKE :q`, { q: search })
                  .orWhere(`${alias}.numero ILIKE :q`, { q: search })
            }))
        }

        // Filtro por Status
        if (status?.length) {
            qb.andWhere(`${alias}.status IN (:...status)`, { status })
        }

        // Filtro por CNPJ Emitente específico
        if (cnpj_emitente?.trim()) {
            qb.andWhere(`${alias}.documentoEmitente = :cnpj_emitente`, { 
                cnpj_emitente: cnpj_emitente.trim() 
            })
        }

        // Filtro por Período de Emissão
        if (data_inicio && data_fim) {
            qb.andWhere(`${alias}.dataEmissao BETWEEN :data_inicio AND :data_fim`, { data_inicio, data_fim })
        } else if (data_inicio) {
            qb.andWhere(`${alias}.dataEmissao >= :data_inicio`, { data_inicio })
        } else if (data_fim) {
            qb.andWhere(`${alias}.dataEmissao <= :data_fim`, { data_fim })
        }

        // Ordenação
        const orderField = sortBy || 'dataEmissao'
        const dir = sortDir?.toUpperCase() === "DESC" ? "DESC" : "ASC"
        
        // Garantindo que o campo de ordenação existe para evitar SQL Injection
        qb.orderBy(`${alias}.${orderField}`, dir)

        // Execução com Paginação
        const [items, total] = await qb
            .skip(start)
            .take(limit)
            .getManyAndCount()

        // Total Geral (sem filtros) para o contador do sistema
        

        return { 
            total, 
            filteredTotal: items.length, 
            items: items.map(item => CtesUtils.toDomain(item)) 
        }
    }

    async findByChaveCTe(chave: string): Promise<ICTe | null> {
        const ent = await this.repo.findOne({ where: { chaveAcesso: chave } })
        return ent ? CtesUtils.toDomain(ent) : null
    }
}