import { Injectable, NotFoundException } from "@nestjs/common"

import { CTeRepositoryImpl } from "./data/repositories/ctes-repository-impl"
import { CTeFilter } from "./domain/repositories/ctes-repository"
import { CTeListResponseDTO, CTeResponseMapper } from "./dto/list-ctes.dto"

@Injectable()
export class CTesService {
    constructor(private repo: CTeRepositoryImpl) { }

    async list(filter: CTeFilter): Promise<CTeListResponseDTO> {
        const result = await this.repo.findMany(filter)
        return {
            total: result.total,
            filteredTotal: result.filteredTotal,
            items: result.items.map(n => CTeResponseMapper.toDto(n))
        }
    }


    async getByChaveCTe(chave: string) {
        const cte = await this.repo.findByChaveCTe(chave)
        if (!cte) throw new NotFoundException("CTe não encontrada")
        return CTeResponseMapper.toDto(cte)
    }
}
