import { Injectable, NotFoundException } from "@nestjs/common"

import { NFeRepositoryImpl } from "./data/repositories/nfes-repository-impl"
import { NFeFilter } from "./domain/repositories/nfes-repository"
import { NFeListResponseDTO, NFeResponseMapper } from "./dto/list-nfes.dto"

@Injectable()
export class NFesService {
    constructor(private repo: NFeRepositoryImpl) { }

    async list(filter: NFeFilter): Promise<NFeListResponseDTO> {
        const result = await this.repo.findMany(filter)
        return {
            total: result.total,
            filteredTotal: result.filteredTotal,
            items: result.items.map(n => NFeResponseMapper.toDto(n))
        }
    }

    async getByChaveNFe(chave: string) {
        const nfe = await this.repo.findByChaveNFe(chave)
        if (!nfe) throw new NotFoundException("NFe não encontrada")
        return NFeResponseMapper.toDto(nfe)
    }
}
