import { TenantModel } from "database/public/entities/tenant"
import { ITenant, Tenant } from "modules/tenants/domain/entities/tenant"

export class TenantUtils {
    static toDomain(tenant: TenantModel): ITenant {
        return new Tenant({
            id: tenant.id,
            uuid: tenant.uuid,
            apiVersion: tenant.apiVersion,
            name: tenant.name,
            cnpj: tenant.cnpj,
            companyName: tenant.companyName,
            tradeName: tenant.tradeName,
            status: tenant.status,
            createdAt: tenant.createdAt,
            isActive: tenant.isActive
        })
    }

    static toModel(tenant: Partial<ITenant>): TenantModel {
        const model = new TenantModel()
        if (tenant.id !== undefined) model.id = tenant.id
        if (tenant.uuid !== undefined) model.uuid = tenant.uuid
        if (tenant.apiVersion !== undefined) model.apiVersion = tenant.apiVersion
        if (tenant.name !== undefined) model.name = tenant.name
        if (tenant.cnpj !== undefined) model.cnpj = tenant.cnpj
        if (tenant.companyName !== undefined) model.companyName = tenant.companyName
        if (tenant.tradeName !== undefined) model.tradeName = tenant.tradeName
        if (tenant.status !== undefined) model.status = tenant.status
        if (tenant.createdAt !== undefined) model.createdAt = tenant.createdAt
        if (tenant.isActive !== undefined) model.isActive = tenant.isActive

        return model
    }

}