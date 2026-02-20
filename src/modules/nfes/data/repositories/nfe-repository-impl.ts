import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { Brackets, DataSource, In, Repository, Between, LessThanOrEqual, MoreThanOrEqual } from "typeorm"

import { NFeModel } from "database/tenant/entities/nfes"
import { TENANT_DATA_SOURCE } from "database/tenant/tenant.datasource.provider"
import { INFe } from "modules/nfes/domain/entities/nfe"
import { INFeRepository, NFeFilter } from "modules/nfes/domain/repositories/nfe-repository"
import { NfesUtils } from "../utils/nfes.utils"

@Injectable()
export class NFeRepository implements INFeRepository {
    private repo: Repository<NFeModel>

    constructor(@Inject(TENANT_DATA_SOURCE) ds: DataSource) {
        this.repo = ds.getRepository(NFeModel)
    }

    async findMany(filter: NFeFilter) {
        const { limit, start, q, status, uf, cnpj_emitente, data_inicio, data_fim, sortBy, sortDir } = filter
        const alias = "nfe"

        const qb = this.repo.createQueryBuilder(alias).select([
            `${alias}.id`,
            `${alias}.uuid`,
            `${alias}.ch_nfe`,
            `${alias}.nsu`,
            `${alias}.uf`,
            `${alias}.numero_nfe`,
            `${alias}.serie_nfe`,
            `${alias}.tipo_documento`,
            `${alias}.data_emissao`,
            `${alias}.valor_total`,
            `${alias}.cnpj_emitente`,
            `${alias}.nome_emitente`,
            `${alias}.cnpj_destinatario`,
            `${alias}.nome_destinatario`,
            `${alias}.natureza_operacao`,
            `${alias}.tipo_movimentacao`,
            `${alias}.status`,
            `${alias}.createdAt`
        ])

        // Filtro de Texto (Busca Global)
        if (q?.trim()) {
            qb.andWhere(new Brackets(or => {
                or.where(`${alias}.ch_nfe ILIKE :q`, { q: `%${q.trim()}%` })
                    .orWhere(`${alias}.cnpj_emitente ILIKE :q`, { q: `%${q.trim()}%` })
                    .orWhere(`${alias}.nome_emitente ILIKE :q`, { q: `%${q.trim()}%` })
                    .orWhere(`${alias}.cnpj_destinatario ILIKE :q`, { q: `%${q.trim()}%` })
                    .orWhere(`${alias}.nome_destinatario ILIKE :q`, { q: `%${q.trim()}%` })
                    .orWhere(`${alias}.nsu ILIKE :q`, { q: `%${q.trim()}%` })
            }))
        }

        // Filtro por Status
        if (status?.length) {
            qb.andWhere(`${alias}.status IN (:...status)`, { status })
        }

        // Filtro por UF
        if (uf?.length) {
            qb.andWhere(`${alias}.uf IN (:...uf)`, { uf })
        }

        // Filtro por CNPJ Emitente
        if (cnpj_emitente?.trim()) {
            qb.andWhere(`${alias}.cnpj_emitente = :cnpj_emitente`, { cnpj_emitente: cnpj_emitente.trim() })
        }

        // Filtro por Período
        if (data_inicio && data_fim) {
            qb.andWhere(`${alias}.data_emissao BETWEEN :data_inicio AND :data_fim`, { data_inicio, data_fim })
        } else if (data_inicio) {
            qb.andWhere(`${alias}.data_emissao >= :data_inicio`, { data_inicio })
        } else if (data_fim) {
            qb.andWhere(`${alias}.data_emissao <= :data_fim`, { data_fim })
        }

        // Ordenação
        const orderField = sortBy || NfesUtils.DEFAULT_SORT
        const dir = sortDir?.toUpperCase() === "DESC" ? "DESC" : "ASC"
        qb.orderBy(`${alias}.${orderField}`, dir)

        // Paginação
        const [items, filteredTotal] = await qb
            .skip(start)
            .take(limit)
            .getManyAndCount()

        // Total Geral
        const total = await this.repo.count()

        return { total, filteredTotal, items: items.map(NfesUtils.toDomain) }
    }

    async findByUuids(uuids: string[]): Promise<INFe[]> {
        const itemsEnt = await this.repo.find({
            where: {
                uuid: In(uuids)
            }
        })

        return itemsEnt.map(NfesUtils.toDomain)
    }

    async findByUuid(uuid: string) {
        const ent = await this.repo.findOne({ where: { uuid } })
        return ent ? NfesUtils.toDomain(ent) : null
    }

    async findByChaveNFe(chave: string) {
        const ent = await this.repo.findOne({ where: { ch_nfe: chave } })
        return ent ? NfesUtils.toDomain(ent) : null
    }

    async createMany(nfes: INFe[]): Promise<INFe[]> {
        const entities = nfes.map(n => NfesUtils.toModel(n))
        try {
            const savedEntities = await this.repo.save(entities)
            return savedEntities.map(saved => NfesUtils.toDomain(saved))
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException("NFe já existe no sistema")
            }
            throw err
        }
    }

    async create(nfe: INFe) {
        const ent = this.repo.create(NfesUtils.toModel(nfe))
        try {
            const saved = await this.repo.save(ent)
            return NfesUtils.toDomain(saved)
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException("NFe já existe no sistema")
            }
            throw err
        }
    }

    async updateMany(nfes: INFe[]): Promise<INFe[]> {
        const models = nfes.map((n) => {
            const model = NfesUtils.toModel(n)
            model.uuid = n.uuid
            return model
        })

        try {
            const saved = await this.repo.save(models)
            return saved.map((n) => NfesUtils.toDomain(n))
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException("Erro de duplicidade em uma ou mais NFes do lote.")
            }
            throw err
        }
    }

    async update(uuid: string, data: Partial<INFe>) {
        const ent = await this.repo.findOne({ where: { uuid } })
        if (!ent) throw new NotFoundException("NFe não encontrada")

        const partialModel = NfesUtils.toModel(data)

        // Mescla os dados
        this.repo.merge(ent, partialModel)

        try {
            const saved = await this.repo.save(ent)
            return NfesUtils.toDomain(saved)
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException("NFe já existe no sistema")
            }
            throw err
        }
    }

    async delete(uuid: string) {
        const res = await this.repo.delete({ uuid })
        if (res.affected === 0) throw new NotFoundException("NFe não encontrada")
    }
}
