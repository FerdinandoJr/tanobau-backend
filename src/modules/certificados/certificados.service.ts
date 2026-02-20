import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"

import { CertificadoRepository } from "./data/repositories/certificado-repository-impl"
import { CertificadoFilter } from "./domain/repositories/certificado-repository"
import { CreateCertificadoDTO } from "./dto/create-certificado.dto"
import { UpdateCertificadoDTO } from "./dto/update-certificado.dto"
import { CertificadoListResponseDTO, CertificadoResponseMapper } from "./dto/list-certificados.dto"
import { UpdateCertificadoBatchDTO } from "./dto/update-certificado-batch.dto"
import { ICertificado } from "./domain/entities/certificado"
import { CreateCertificadoBatchDTO } from "./dto/create-certificado-batch.dto"

@Injectable()
export class CertificadoService {
    constructor(private repo: CertificadoRepository) { }

    async list(filter: CertificadoFilter): Promise<CertificadoListResponseDTO> {
        const result = await this.repo.findMany(filter)
        return {
            total: result.total,
            filteredTotal: result.filteredTotal,
            items: result.items.map(c => CertificadoResponseMapper.toListItem(c))
        }
    }

    async listByUuids(uuids: string[]) {
        return this.repo.findByUuids(uuids)
    }

    async get(uuid: string) {
        const cert = await this.repo.findByUuid(uuid)
        if (!cert) throw new NotFoundException("Certificado não encontrado")
        return cert
    }

    async getByThumbprint(thumbprint: string) {
        const cert = await this.repo.findByThumbprint(thumbprint)
        if (!cert) throw new NotFoundException("Certificado não encontrado")
        return cert
    }

    async getByCnpj(cnpj: string) {
        return await this.repo.findByCnpj(cnpj)
    }

    async create(input: CreateCertificadoDTO, binaryFile: Buffer) {
        const validated = input.validate(binaryFile)
        return await this.repo.create(validated)
    }

    async createBatch(body: CreateCertificadoBatchDTO) {
        // const { items } = body
        // if (items.length > 50) throw new BadRequestException("O limite máximo é de 50 registros por lote.")
        // const validated = items.map(dto => dto.validate())
        // const savedItems = await this.repo.createMany(validated)
        // return { items: savedItems }
    }

    async updateBatch(body: UpdateCertificadoBatchDTO) {
        const { items } = body
        if (items.length > 50) throw new BadRequestException("O limite máximo é de 50 registros por lote.")

        const uuids = items.map(i => i.uuid)
        const certs = await this.repo.findByUuids(uuids)
        const certMap = new Map<string, ICertificado>(certs.map(c => [c.uuid, c]))

        const certsToUpdate = items.map(dto => {
            const cert = certMap.get(dto.uuid)
            if (!cert) throw new NotFoundException('Certificado não encontrado')

            const validated = dto.validate()
            return { ...cert, ...validated }
        })

        const savedItems = await this.repo.updateMany(certsToUpdate)
        return { items: savedItems }
    }

    async update(uuid: string, patch: UpdateCertificadoDTO) {
        const validated = patch.validate()
        return await this.repo.update(uuid, validated)
    }

    async remove(uuid: string) {
        await this.repo.delete(uuid)
    }
}
