import { TenantModel } from "database/public/entities/tenant"
import { ITenant, Tenant } from "modules/tenants/domain/entities/tenant"
import { CompanyUtils } from "modules/companies/data/utils/company.utils"

export type TenantSortBy = typeof TenantUtils.SORTABLE_FIELDS[number]

export class TenantUtils {

    static readonly SORTABLE_FIELDS: readonly (keyof ITenant)[] = [
        "id",
        "name",
        "status",
        "createdAt",
    ] as const

    static readonly DEFAULT_SORT: keyof ITenant = "id"

    static toDomain(model: TenantModel): ITenant {
        return new Tenant({
            id: model.id,
            uuid: model.uuid,
            apiVersion: model.apiVersion,
            name: model.name,
            status: model.status,
            createdAt: model.createdAt,
            isActive: model.isActive,
            company: model.company ? CompanyUtils.toDomain(model.company) : null,
        })
    }

    static toModel(tenant: Partial<ITenant>): Partial<TenantModel> {
        const model: Partial<TenantModel> = {}

        if (tenant.id !== undefined) model.id = tenant.id
        if (tenant.uuid !== undefined) model.uuid = tenant.uuid
        if (tenant.apiVersion !== undefined) model.apiVersion = tenant.apiVersion
        if (tenant.name !== undefined) model.name = tenant.name
        if (tenant.status !== undefined) model.status = tenant.status
        if (tenant.createdAt !== undefined) model.createdAt = tenant.createdAt
        if (tenant.isActive !== undefined) model.isActive = tenant.isActive

        return model
    }
}