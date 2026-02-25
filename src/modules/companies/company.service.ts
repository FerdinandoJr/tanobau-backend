import { Injectable, NotFoundException } from "@nestjs/common"
import { CompanyRepository } from "./data/repositories/company.repository.impl"
import { CompanyFilter } from "./domain/repositories/company.repository"
import { CreateCompanyDTO } from "./dto/create-company.dto"
import { UpdateCompanyDTO } from "./dto/update-company.dto"

@Injectable()
export class CompanyService {
    constructor(private repo: CompanyRepository) { }

    async list(filter: CompanyFilter) {
        return await this.repo.findMany(filter)
    }

    async get(uuid: string) {
        const company = await this.repo.findByUuid(uuid)
        if (!company) throw new NotFoundException("Company not found")
        return company
    }

    async create(input: CreateCompanyDTO) {
        const company = input.validate()
        return await this.repo.create(company)
    }

    async update(uuid: string, patch: UpdateCompanyDTO) {
        const validated = patch.validate()
        return await this.repo.update(uuid, validated)
    }

    async remove(uuid: string) {
        return await this.repo.delete(uuid)
    }
}
