import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"

import { NFeRepository } from "./data/repositories/nfe-repository-impl"
import { NFeFilter } from "./domain/repositories/nfe-repository"
import { CreateNFeDTO } from "./dto/create-nfe.dto"
import { UpdateNFeDTO } from "./dto/update-nfe.dto"
import { NFeListResponseDTO, NFeResponseMapper } from "./dto/list-nfes.dto"
import { UpdateNFeBatchDTO } from "./dto/update-nfe-batch.dto"
import { INFe } from "./domain/entities/nfe"
import { CreateNFeBatchDTO } from "./dto/create-nfe-batch.dto"

@Injectable()
export class NFeService {
    constructor(private repo: NFeRepository) { }

    async list(filter: NFeFilter): Promise<NFeListResponseDTO> {
        const result = await this.repo.findMany(filter)
        return {
            total: result.total,
            filteredTotal: result.filteredTotal,
            items: result.items.map(n => NFeResponseMapper.toListItem(n))
        }
    }

    async listByUuids(uuids: string[]) {
        return this.repo.findByUuids(uuids)
    }

    async get(uuid: string) {
        const nfe = await this.repo.findByUuid(uuid)
        if (!nfe) throw new NotFoundException("NFe não encontrada")
        return nfe
    }

    async getByChaveNFe(chave: string) {
        const nfe = await this.repo.findByChaveNFe(chave)
        if (!nfe) throw new NotFoundException("NFe não encontrada")
        return nfe
    }

    async create(input: CreateNFeDTO) {
        const validated = input.validate()
        return await this.repo.create(validated)
    }

    async createBatch(body: CreateNFeBatchDTO) {
        const { items } = body
        if (items.length > 50) throw new BadRequestException("O limite máximo é de 50 registros por lote.")
        const validated = items.map(dto => dto.validate())
        const savedItems = await this.repo.createMany(validated)
        return { items: savedItems }
    }

    async updateBatch(body: UpdateNFeBatchDTO) {
        const { items } = body
        if (items.length > 50) throw new BadRequestException("O limite máximo é de 50 registros por lote.")

        const uuids = items.map(i => i.uuid)
        const nfes = await this.repo.findByUuids(uuids)
        const nfeMap = new Map<string, INFe>(nfes.map(n => [n.uuid, n]))

        const nfesToUpdate = items.map(dto => {
            const nfe = nfeMap.get(dto.uuid)
            if (!nfe) throw new NotFoundException('NFe não encontrada')

            const validated = dto.validate()
            return { ...nfe, ...validated }
        })

        const savedItems = await this.repo.updateMany(nfesToUpdate)
        return { items: savedItems }
    }

    async update(uuid: string, patch: UpdateNFeDTO) {
        const validated = patch.validate()
        return await this.repo.update(uuid, validated)
    }

    async remove(uuid: string) {
        await this.repo.delete(uuid)
    }
}
