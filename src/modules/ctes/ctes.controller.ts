import { Controller, DefaultValuePipe, Get, Param, Query, ParseIntPipe } from "@nestjs/common"

import { Auth } from "core/http/decorators/auth.decorator"
import { SortByPipe } from "core/http/pipes/sortBy.pipe"
import { SortDir, SortDirPipe } from "core/http/pipes/sortDir.pipe"

import { CTeSortBy, CtesUtils } from "./data/utils/ctes.utils"
import { DocumentoFiscalStatus } from "core/valueObjects/documento-fiscal-status.enum"
import { CTesService } from "./ctes.services"

@Auth()
@Controller("ctes")
export class CTesController {
    constructor(private service: CTesService) { }

    @Get()                               
    async list(
        @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query("start", new DefaultValuePipe(0), ParseIntPipe) start: number,
        @Query("sortDir", new SortDirPipe()) sortDir: SortDir,
        @Query("sortBy", new SortByPipe<CTeSortBy>(CtesUtils.DEFAULT_SORT, CtesUtils.SORTABLE_FIELDS)) sortBy: CTeSortBy,
        @Query("q") q?: string,
        @Query("status") rawStatus?: string | string[],
        @Query("uf") rawUf?: string | string[],
        @Query("cnpj_emitente") cnpj_emitente?: string,
        @Query("data_inicio") data_inicio?: string,
        @Query("data_fim") data_fim?: string
    ) {
        const allowedStatus = new Set(Object.values(DocumentoFiscalStatus))
        const status =
            rawStatus === undefined
                ? undefined
                : (Array.isArray(rawStatus) ? rawStatus : [rawStatus])
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .filter((v): v is DocumentoFiscalStatus => allowedStatus.has(v as DocumentoFiscalStatus))

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

  
    @Get(":chave")
    async getByChave(@Param("chave") chave: string) {
        return await this.service.getByChaveCTe(chave)
    }
}
