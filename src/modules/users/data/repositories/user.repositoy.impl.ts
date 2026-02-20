import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common"
import { Brackets, DataSource, Repository } from "typeorm"

import { UserUtils } from "../utils/user.utils"

import { Email } from "core/valueObjects"
import { UserModel } from "database/public/entities/user"
import { PUBLIC_DATA_SOURCE } from "database/public/public.datasource.provider"
import { IUser } from "modules/users/domain/entities/user"
import { IUserRepository, UserFilter } from "modules/users/domain/repositories/user.repository"


@Injectable()
export class UserRepository implements IUserRepository {
    private repo: Repository<UserModel>

    constructor(@Inject(PUBLIC_DATA_SOURCE) ds: DataSource) {
        this.repo = ds.getRepository(UserModel)
    }

    async findMany(filter: UserFilter) {
        const { start, limit, q, sortBy, sortDir } = filter
        const alias = "u"

        const qb = this.repo.createQueryBuilder(alias)

        if (q?.trim()) {
            qb.andWhere(new Brackets(or => {
                or.where(`${alias}.code ILIKE :q`, { q: `%${q.trim()}%` })
            }))
        }

        const orderField = sortBy || UserUtils.DEFAULT_SORT
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
            items: itemsEnt.map(UserUtils.toDomain),
        }
    }

    async findByUuid(uuid: string) {
        const ent = await this.repo.findOne({ where: { uuid }, relations: ["tenant"] })
        return ent ? UserUtils.toDomain(ent) : null
    }

    async findByEmail(email: Email) {
        const user = await this.repo.findOne({
            where: { email },
            relations: ["tenant"]
        });
        return user ? UserUtils.toDomain(user) : null;
    }

    async create(user: IUser) {
        try {
            const created = this.repo.create({ ...UserUtils.toModel(user) })
            const saved = await this.repo.save(created)
            return UserUtils.toDomain(saved)
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException(`User already exists`)
            }
            throw err
        }
    }

    async update(uuid: string, data: Partial<IUser>): Promise<IUser> {
        const ent = await this.repo.findOne({ where: { uuid } })
        if (!ent) throw new ConflictException(`User not found`)

        const model = UserUtils.toModel(data)

        try {
            const saved = await this.repo.save({ ...ent, ...model })
            return UserUtils.toDomain(saved)
        } catch (err: any) {
            if (err?.code === "23505") {
                throw new ConflictException(`User already exists`)
            }
            throw err
        }
    }

    async delete(uuid: string): Promise<void> {
        const res = await this.repo.delete({ uuid })
        if (res.affected === 0) throw new NotFoundException(`User not found`)
    }
}
