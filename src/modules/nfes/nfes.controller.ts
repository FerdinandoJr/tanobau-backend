import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Put, Query, ParseIntPipe } from "@nestjs/common"

import { Auth } from "core/http/decorators/auth.decorator"
import { SortByPipe } from "core/http/pipes/sortBy.pipe"
import { SortDir, SortDirPipe } from "core/http/pipes/sortDir.pipe"

import { NFeSortBy, NfesUtils } from "./data/utils/nfes.utils"
import { DocumentStatus } from "modules/nfes/domain/valueObjects/document-status.enum"
import { CreateNFeDTO } from "./dto/create-nfe.dto"
import { UpdateNFeDTO } from "./dto/update-nfe.dto"
import { NFeService } from "./nfes.service"
import { UpdateNFeBatchDTO } from "./dto/update-nfe-batch.dto"
import { CreateNFeBatchDTO } from "./dto/create-nfe-batch.dto"

@Auth()
@Controller("nfes")
export class NFeController {
    constructor(private service: NFeService) { }

    @Get()
    async list(
        @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query("start", new DefaultValuePipe(0), ParseIntPipe) start: number,
        @Query("sortDir", new SortDirPipe()) sortDir: SortDir,
        @Query("sortBy", new SortByPipe<NFeSortBy>(NfesUtils.DEFAULT_SORT, NfesUtils.SORTABLE_FIELDS)) sortBy: NFeSortBy,
        @Query("q") q?: string,
        @Query("status") rawStatus?: string | string[],
        @Query("uf") rawUf?: string | string[],
        @Query("cnpj_emitente") cnpj_emitente?: string,
        @Query("data_inicio") data_inicio?: string,
        @Query("data_fim") data_fim?: string
    ) {
        const allowedStatus = new Set(Object.values(DocumentStatus))
        const status =
            rawStatus === undefined
                ? undefined
                : (Array.isArray(rawStatus) ? rawStatus : [rawStatus])
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .filter((v): v is DocumentStatus => allowedStatus.has(v as DocumentStatus))

        const uf =
            rawUf === undefined
                ? undefined
                : (Array.isArray(rawUf) ? rawUf : [rawUf])
                    .map((s) => s.trim().toUpperCase())
                    .filter(Boolean)

        const parsedDataInicio = data_inicio ? new Date(data_inicio) : undefined
        const parsedDataFim = data_fim ? new Date(data_fim) : undefined

        return await this.service.list({
            q,
            status,
            uf,
            cnpj_emitente,
            data_inicio: parsedDataInicio,
            data_fim: parsedDataFim,
            sortBy,
            sortDir: sortDir.toLowerCase() as "asc" | "desc",
            limit,
            start,
        })
    }

    @Post("batch")
    @HttpCode(201)
    async createBatch(@Body() body: CreateNFeBatchDTO) {
        return await this.service.createBatch(body)
    }

    @Patch("batch")
    @HttpCode(200)
    async updateBatch(@Body() body: UpdateNFeBatchDTO) {
        return await this.service.updateBatch(body)
    }

    @Get("chave/:chave")
    async getByChave(@Param("chave") chave: string) {
        return await this.service.getByChaveNFe(chave)
    }

    @Get(":uuid")
    async getByUuid(@Param("uuid", ParseUUIDPipe) uuid: string) {
        return await this.service.get(uuid)
    }

    @Post()
    @HttpCode(201)
    async create(@Body() body: CreateNFeDTO) {
        return await this.service.create(body)
    }

    @Put(":uuid")
    async update(@Param("uuid", ParseUUIDPipe) uuid: string, @Body() body: UpdateNFeDTO) {
        return await this.service.update(uuid, body)
    }

    @Delete(":uuid")
    @HttpCode(204)
    async remove(@Param("uuid", ParseUUIDPipe) uuid: string) {
        await this.service.remove(uuid)
    }
}
