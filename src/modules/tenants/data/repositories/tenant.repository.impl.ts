import { ConflictException, Inject, NotFoundException } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"

import { TenantUtils } from "../utils/tenant.utils"

import { TenantModel } from "database/public/entities/tenant"
import { ITenant } from "modules/tenants/domain/entities/tenant"
import { ITenantRepository } from "modules/tenants/domain/repositories/tenant.repository"
import { IUser } from "modules/users/domain/entities/user"
import { PUBLIC_DATA_SOURCE } from "database/public/public.datasource.provider"


export class TenantRepository implements ITenantRepository {
    private repo: Repository<TenantModel>

    constructor(@Inject(PUBLIC_DATA_SOURCE) ds: DataSource) {
        this.repo = ds.getRepository(TenantModel)
    }

    async findByUser(user: IUser): Promise<ITenant[]> {
        const tenants = await this.repo.createQueryBuilder("tenant")
            .innerJoin("tenant.company", "company")
            .innerJoin("company.userTenants", "ut")
            .where("ut.userId = :userId", { userId: user.id })
            .getMany()
        return tenants.map(TenantUtils.toDomain)
    }

    async findByName(name: string): Promise<ITenant | null> {
        const ent = await this.repo.findOne({ where: { name } })
        return ent ? TenantUtils.toDomain(ent) : null
    }

    async findById(id: number): Promise<ITenant | null> {
        const ent = await this.repo.findOne({ where: { id }, relations: ['company'] })
        return ent ? TenantUtils.toDomain(ent) : null
    }

    async findByUuid(uuid: string): Promise<ITenant | null> {
        const ent = await this.repo.findOne({ where: { uuid }, relations: ['company'] })
        return ent ? TenantUtils.toDomain(ent) : null
    }

    async create(tenant: ITenant): Promise<ITenant> {
        const ent = this.repo.create(TenantUtils.toModel(tenant) as TenantModel)
        try {
            const saved = await this.repo.save(ent)
            return TenantUtils.toDomain(saved)
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException(`Tenant already exists`)
            }
            throw err
        }
    }

    async update(uuid: string, data: Partial<ITenant>): Promise<ITenant> {
        const ent = await this.repo.findOne({ where: { uuid } })
        if (!ent) throw new NotFoundException(`Tenant "${uuid}" not found`)

        this.repo.merge(ent, TenantUtils.toModel(data))

        try {
            const saved = await this.repo.save(ent)
            return TenantUtils.toDomain(saved)
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException(`Tenant already exists`)
            }
            throw err
        }
    }

    async delete(uuid: string): Promise<void> {
        const res = await this.repo.delete({ uuid })
        if (res.affected === 0) {
            throw new NotFoundException(`Tenant "${uuid}" not found`)
        }
    }
}
