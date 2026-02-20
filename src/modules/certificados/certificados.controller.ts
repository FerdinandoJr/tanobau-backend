import { BadRequestException, Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseUUIDPipe, Patch, Post, Put, Query, ParseIntPipe, ParseBoolPipe, UseInterceptors, UploadedFile } from "@nestjs/common"

import { Auth } from "core/http/decorators/auth.decorator"
import { SortByPipe } from "core/http/pipes/sortBy.pipe"
import { SortDir, SortDirPipe } from "core/http/pipes/sortDir.pipe"

import { CertificadoSortBy, CertificadosUtils } from "./data/utils/certificados.utils"
import { CertificadoAmbiente } from "./domain/valueObjects/certificado-ambiente.enum"
import { CreateCertificadoDTO } from "./dto/create-certificado.dto"
import { UpdateCertificadoDTO } from "./dto/update-certificado.dto"
import { CertificadoService } from "./certificados.service"
import { UpdateCertificadoBatchDTO } from "./dto/update-certificado-batch.dto"
import { CreateCertificadoBatchDTO } from "./dto/create-certificado-batch.dto"
import { FileInterceptor } from "@nestjs/platform-express"

@Auth()
@Controller("certificados")
export class CertificadoController {
    constructor(private service: CertificadoService) { }

    @Get()
    async list(
        @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query("start", new DefaultValuePipe(0), ParseIntPipe) start: number,
        @Query("sortDir", new SortDirPipe()) sortDir: SortDir,
        @Query("sortBy", new SortByPipe<CertificadoSortBy>(CertificadosUtils.DEFAULT_SORT, CertificadosUtils.SORTABLE_FIELDS)) sortBy: CertificadoSortBy,
        @Query("q") q?: string,
        @Query("ambiente") rawAmbiente?: string | string[],
        @Query("cnpj") cnpj?: string,
        @Query("isActive") isActive?: string,
        @Query("isPrimary") isPrimary?: string,
        @Query("expiresAfter") expiresAfter?: string,
        @Query("expiresBefore") expiresBefore?: string
    ) {
        const allowedAmbiente = new Set(Object.values(CertificadoAmbiente))
        const ambiente =
            rawAmbiente === undefined
                ? undefined
                : (Array.isArray(rawAmbiente) ? rawAmbiente : [rawAmbiente])
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .filter((v): v is CertificadoAmbiente => allowedAmbiente.has(v as CertificadoAmbiente))

        const parsedIsActive = isActive !== undefined ? isActive === 'true' : undefined
        const parsedIsPrimary = isPrimary !== undefined ? isPrimary === 'true' : undefined
        const parsedExpiresAfter = expiresAfter ? new Date(expiresAfter) : undefined
        const parsedExpiresBefore = expiresBefore ? new Date(expiresBefore) : undefined

        return await this.service.list({
            q,
            ambiente,
            cnpj,
            isActive: parsedIsActive,
            isPrimary: parsedIsPrimary,
            expiresAfter: parsedExpiresAfter,
            expiresBefore: parsedExpiresBefore,
            sortBy,
            sortDir: sortDir.toLowerCase() as "asc" | "desc",
            limit,
            start,
        })
    }

    @Post("batch")
    @HttpCode(201)
    async createBatch(@Body() body: CreateCertificadoBatchDTO) {
        return await this.service.createBatch(body)
    }

    @Patch("batch")
    @HttpCode(200)
    async updateBatch(@Body() body: UpdateCertificadoBatchDTO) {
        return await this.service.updateBatch(body)
    }

    @Get("thumbprint/:thumbprint")
    async getByThumbprint(@Param("thumbprint") thumbprint: string) {
        return await this.service.getByThumbprint(thumbprint)
    }

    @Get("cnpj/:cnpj")
    async getByCnpj(@Param("cnpj") cnpj: string) {
        return await this.service.getByCnpj(cnpj)
    }

    @Get(":uuid")
    async getByUuid(@Param("uuid", ParseUUIDPipe) uuid: string) {
        return await this.service.get(uuid)
    }

    @Post()
    @UseInterceptors(FileInterceptor('file')) // 'file' é o nome do campo no formulário
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreateCertificadoDTO
    ) {
        if (!file) throw new BadRequestException("Arquivo do certificado é obrigatório")
        return await this.service.create(body, file.buffer)
    }


    @Put(":uuid")
    async update(@Param("uuid", ParseUUIDPipe) uuid: string, @Body() body: UpdateCertificadoDTO) {
        return await this.service.update(uuid, body)
    }

    @Delete(":uuid")
    @HttpCode(204)
    async remove(@Param("uuid", ParseUUIDPipe) uuid: string) {
        await this.service.remove(uuid)
    }
}
