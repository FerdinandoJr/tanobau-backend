import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { Brackets, DataSource, In, Repository, MoreThanOrEqual, LessThanOrEqual } from "typeorm"

import { CertificadoModel } from "database/tenant/entities/certificados"
import { TENANT_DATA_SOURCE } from "database/tenant/tenant.datasource.provider"
import { ICertificado } from "modules/certificados/domain/entities/certificado"
import { ICertificadoRepository, CertificadoFilter } from "modules/certificados/domain/repositories/certificado-repository"
import { CertificadosUtils } from "../utils/certificados.utils"
import { CNPJ } from "core/valueObjects/cnpj"

@Injectable()
export class CertificadoRepository implements ICertificadoRepository {
    private repo: Repository<CertificadoModel>

    constructor(@Inject(TENANT_DATA_SOURCE) ds: DataSource) {
        this.repo = ds.getRepository(CertificadoModel)
    }

    async findMany(filter: CertificadoFilter) {
        const { limit, start, q, ambiente, cnpj, isActive, isPrimary, expiresAfter, expiresBefore, sortBy, sortDir } = filter
        const alias = "cert"

        const qb = this.repo.createQueryBuilder(alias)

        // Filtro de Texto (Busca Global)
        if (q?.trim()) {
            qb.andWhere(new Brackets(or => {
                or.where(`${alias}.companyName ILIKE :q`, { q: `%${q.trim()}%` })
                    .orWhere(`${alias}.thumbprint ILIKE :q`, { q: `%${q.trim()}%` })
                    .orWhere(`${alias}.issuer ILIKE :q`, { q: `%${q.trim()}%` })
                    .orWhere(`${alias}.subject ILIKE :q`, { q: `%${q.trim()}%` })
            }))
        }

        // Filtro por Ambiente
        if (ambiente?.length) {
            qb.andWhere(`${alias}.ambiente IN (:...ambiente)`, { ambiente })
        }

        // Filtro por CNPJ
        if (cnpj?.trim()) {
            qb.andWhere(`${alias}.cnpj = :cnpj`, { cnpj: cnpj.trim() })
        }

        // Filtro por Status Ativo
        if (isActive !== undefined) {
            qb.andWhere(`${alias}.isActive = :isActive`, { isActive })
        }

        // Filtro por Certificado Principal
        if (isPrimary !== undefined) {
            qb.andWhere(`${alias}.isPrimary = :isPrimary`, { isPrimary })
        }

        // Filtro por Data de Expiração
        if (expiresAfter) {
            qb.andWhere(`${alias}.expirationDate >= :expiresAfter`, { expiresAfter })
        }
        if (expiresBefore) {
            qb.andWhere(`${alias}.expirationDate <= :expiresBefore`, { expiresBefore })
        }

        // Ordenação
        const orderField = sortBy || CertificadosUtils.DEFAULT_SORT
        const dir = sortDir?.toUpperCase() === "DESC" ? "DESC" : "ASC"
        qb.orderBy(`${alias}.${orderField}`, dir)

        // Paginação
        const [items, filteredTotal] = await qb
            .skip(start)
            .take(limit)
            .getManyAndCount()

        // Total Geral
        const total = await this.repo.count()

        return { total, filteredTotal, items: items.map(CertificadosUtils.toDomain) }
    }

    async findByUuids(uuids: string[]): Promise<ICertificado[]> {
        const itemsEnt = await this.repo.find({
            where: {
                uuid: In(uuids)
            }
        })

        return itemsEnt.map(CertificadosUtils.toDomain)
    }

    async findByUuid(uuid: string) {
        const ent = await this.repo.findOne({ where: { uuid } })
        return ent ? CertificadosUtils.toDomain(ent) : null
    }

    async findByThumbprint(thumbprint: string) {
        const ent = await this.repo.findOne({ where: { thumbprint } })
        return ent ? CertificadosUtils.toDomain(ent) : null
    }

    async findByCnpj(cnpjValue: string) {
        const cnpj = new CNPJ(cnpjValue)
        const items = await this.repo.find({ where: { cnpj } })
        return items.map(CertificadosUtils.toDomain)
    }

    async createMany(certificados: ICertificado[]): Promise<ICertificado[]> {
        const entities = certificados.map(c => CertificadosUtils.toModel(c))
        try {
            const savedEntities = await this.repo.save(entities)
            return savedEntities.map(saved => CertificadosUtils.toDomain(saved))
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException("Certificado já existe no sistema")
            }
            throw err
        }
    }

    async create(certificado: ICertificado) {
        const ent = this.repo.create(CertificadosUtils.toModel(certificado))
        try {
            const saved = await this.repo.save(ent)
            return CertificadosUtils.toDomain(saved)
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException("Certificado já existe no sistema")
            }
            throw err
        }
    }

    async updateMany(certificados: ICertificado[]): Promise<ICertificado[]> {
        const models = certificados.map((c) => {
            const model = CertificadosUtils.toModel(c)
            model.uuid = c.uuid
            return model
        })

        try {
            const saved = await this.repo.save(models)
            return saved.map((c) => CertificadosUtils.toDomain(c))
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException("Erro de duplicidade em um ou mais certificados do lote.")
            }
            throw err
        }
    }

    async update(uuid: string, data: Partial<ICertificado>) {
        const ent = await this.repo.findOne({ where: { uuid } })
        if (!ent) throw new NotFoundException("Certificado não encontrado")

        const partialModel = CertificadosUtils.toModel(data)

        // Mescla os dados
        this.repo.merge(ent, partialModel)

        try {
            const saved = await this.repo.save(ent)
            return CertificadosUtils.toDomain(saved)
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException("Certificado já existe no sistema")
            }
            throw err
        }
    }

    async delete(uuid: string) {
        const res = await this.repo.delete({ uuid })
        if (res.affected === 0) throw new NotFoundException("Certificado não encontrado")
    }
}
