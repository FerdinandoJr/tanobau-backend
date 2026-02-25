import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { Brackets, DataSource, Repository } from "typeorm"

import { CompanyUtils } from "../utils/company.utils"
import { CompanyModel } from "database/public/entities/company"
import { PUBLIC_DATA_SOURCE } from "database/public/public.datasource.provider"
import { ICompany } from "modules/companies/domain/entities/company"
import { CompanyFilter, ICompanyRepository } from "modules/companies/domain/repositories/company.repository"

@Injectable()
export class CompanyRepository implements ICompanyRepository {
    private repo: Repository<CompanyModel>

    constructor(@Inject(PUBLIC_DATA_SOURCE) ds: DataSource) {
        this.repo = ds.getRepository(CompanyModel)
    }

    async findMany(filter: CompanyFilter) {
        const { start, limit, q, sortBy, sortDir } = filter
        const alias = "c"

        const qb = this.repo.createQueryBuilder(alias)

        if (q?.trim()) {
            qb.andWhere(new Brackets(or => {
                or.where(`${alias}.companyName ILIKE :q`, { q: `%${q.trim()}%` })
                  .orWhere(`${alias}.cnpj ILIKE :q`, { q: `%${q.trim()}%` })
            }))
        }

        const orderField = sortBy || CompanyUtils.DEFAULT_SORT
        const dir = sortDir?.toUpperCase() === "DESC" ? "DESC" : "ASC"

        qb.orderBy(`${alias}.${orderField}`, dir)

        const [itemsEnt, filteredTotal] = await qb
            .skip(start)
            .take(limit)
            .getManyAndCount()

        const total = await this.repo.count()

        return {
            total,
            filteredTotal,
            items: itemsEnt.map(CompanyUtils.toDomain),
        }
    }

    async findByUuid(uuid: string) {
        const ent = await this.repo.findOne({ where: { uuid }, relations: ["tenant"] })
        return ent ? CompanyUtils.toDomain(ent) : null
    }

    async findByCnpj(cnpj: string) {
        const ent = await this.repo.findOne({ where: { cnpj } as any })
        return ent ? CompanyUtils.toDomain(ent) : null
    }

    async create(company: ICompany) {
        try {
            const created = this.repo.create({ ...CompanyUtils.toModel(company) } as CompanyModel)
            const saved = await this.repo.save(created)
            return CompanyUtils.toDomain(saved)
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException(`Company already exists`)
            }
            throw err
        }
    }

    async update(uuid: string, data: Partial<ICompany>): Promise<ICompany> {
        const ent = await this.repo.findOne({ where: { uuid } })
        if (!ent) throw new NotFoundException(`Company not found`)

        const patch = CompanyUtils.toModel(data)

        try {
            const saved = await this.repo.save({ ...ent, ...patch })
            return CompanyUtils.toDomain(saved)
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException(`Company already exists`)
            }
            throw err
        }
    }

    async delete(uuid: string): Promise<void> {
        const res = await this.repo.delete({ uuid })
        if (res.affected === 0) throw new NotFoundException(`Company not found`)
    }
}
