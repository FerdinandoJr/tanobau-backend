import { Email } from "core/valueObjects"
import { IUser } from "../domain/entities/user"
import { UserType } from "../domain/valueObjects"

export type UserResponseDTO = {
    uuid: string
    firstName: string
    lastName: string
    email: string
    status: string
    type: UserType
}

export type UserListResponseDTO = {
    total: number
    filteredTotal: number
    items: UserResponseDTO[]
}

export const UserResponseMapper = {
    toListItem(u: IUser): UserResponseDTO {
        return {
            uuid: u.uuid,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email.value,
            status: u.status,
            type: u.type
        }
    }
}