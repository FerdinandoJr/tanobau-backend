import { Injectable, NotFoundException } from "@nestjs/common"
import { UserRepository } from "./data/repositories/user.repositoy.impl"
import { UserFilter } from "./domain/repositories/user.repository"
import { CreateUserDTO } from "./dto/create.user.dto"
import { UpdateUserDTO } from "./dto/update.user.dto"

@Injectable()
export class UserService {
  constructor(private repo: UserRepository) { }

  async list(filter: UserFilter) {
    return await this.repo.findMany(filter)
  }

  async get(uuid: string) {
    const u = await this.repo.findByUuid(uuid)
    if (!u) throw new NotFoundException("User not found")
    return u
  }

  async create(input: CreateUserDTO) {
    const user = input.validate()

    return await this.repo.create(user)
  }

  async update(uuid: string, patch: UpdateUserDTO) {
    const validated = patch.validate()
    return await this.repo.update(uuid, validated)
  }

  async remove(uuid: string) {
    return await this.repo.delete(uuid)
  }
}