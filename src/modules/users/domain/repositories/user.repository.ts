import { IUser } from "../entities/user"

import { Email } from "core/valueObjects"



// Lista com as chaves permitidas (checada contra IUser)
// Tipo só com as chaves permitidas

export interface UserFilter {
  limit: number
  start: number
  q?: string
  sortBy?: keyof IUser
  sortDir?: "ASC" | "DESC"
}


export interface IUserRepository {
  findMany(filter: UserFilter): Promise<{ total: number, filteredTotal: number, items: IUser[] }>
  findByUuid(uuid: string): Promise<IUser | null>
  findByEmail(email: Email): Promise<IUser | null>
  create(uom: IUser): Promise<IUser>
  update(uuid: string, data: Partial<IUser>): Promise<IUser>
  delete(uuid: string): Promise<void>
}
