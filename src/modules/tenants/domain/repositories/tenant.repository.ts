import { ITenant } from "../entities/tenant"
import { IUser } from "modules/users/domain/entities/user"

export interface TenantFilter {
  start: number
  limit: number
  q?: string
  sortBy?: keyof ITenant
  sortDir?: "ASC" | "DESC"
}


export interface ITenantRepository {
  findByUser(user: IUser): Promise<ITenant[]>
  findByName(name: string): Promise<ITenant | null>
  findById(id: number): Promise<ITenant | null>
  findByUuid(uuid: string): Promise<ITenant | null>
  create(tenant: ITenant): Promise<ITenant>
  update(uuid: string, data: Partial<ITenant>): Promise<ITenant>
  delete(uuid: string): Promise<void>
}