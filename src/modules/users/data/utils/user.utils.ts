import { UserModel } from "database/public/entities/user"
import { CompanyUtils } from "modules/companies/data/utils/company.utils"
import { IUser, User } from "modules/users/domain/entities/user"

export type UserSortBy = typeof UserUtils.SORTABLE_FIELDS[number]

export class UserUtils {

    static readonly SORTABLE_FIELDS: readonly (keyof IUser)[] = [
        "id",
        "firstName",
        "lastName",
        "email",
        "createdAt"
    ] as const

    static readonly DEFAULT_SORT: keyof IUser = "id"

    static toDomain(model: UserModel): IUser {
        return new User({
            id: model.id,
            uuid: model.uuid,
            email: model.email,
            firstName: model.firstName,
            lastName: model.lastName,
            password: model.password,
            status: model.status,
            type: model.type,
            createdAt: model.createdAt,
            companies: (model.userTenants ?? []).map(ut => CompanyUtils.toDomain(ut.company)),
        })
    }

    static toModel(user: Partial<IUser>): UserModel {
        const model = new UserModel()

        if (user.id !== undefined) model.id = user.id
        if (user.uuid !== undefined) model.uuid = user.uuid
        if (user.email !== undefined) model.email = user.email
        if (user.firstName !== undefined) model.firstName = user.firstName
        if (user.lastName !== undefined) model.lastName = user.lastName
        if (user.password !== undefined) model.password = user.password
        if (user.status !== undefined) model.status = user.status
        if (user.type !== undefined) model.type = user.type
        if (user.createdAt !== undefined) model.createdAt = user.createdAt

        return model
    }
}