import {
    Body,
    Controller,
    DefaultValuePipe,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
} from "@nestjs/common"

import { CompanySortBy, CompanyUtils } from "./data/utils/company.utils"
import { CreateCompanyDTO } from "./dto/create-company.dto"
import { UpdateCompanyDTO } from "./dto/update-company.dto"
import { CompanyService } from "./company.service"

import { Auth } from "core/http/decorators/auth.decorator"
import { SortByPipe } from "core/http/pipes/sortBy.pipe"
import { SortDir, SortDirPipe } from "core/http/pipes/sortDir.pipe"

@Auth()
@Controller("companies")
export class CompanyController {
    constructor(private service: CompanyService) { }

    @Get()
    async findAll(
        @Query("limit", new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query("start", new DefaultValuePipe(0), ParseIntPipe) start: number,
        @Query("sortDir", new SortDirPipe()) sortDir: SortDir,
        @Query("sortBy", new SortByPipe<CompanySortBy>("id", CompanyUtils.SORTABLE_FIELDS)) sortBy: CompanySortBy,
        @Query("q") q?: string,
    ) {
        return await this.service.list({ q, sortBy, sortDir, limit, start })
    }

    @Get(":uuid")
    async findOne(@Param("uuid", ParseUUIDPipe) uuid: string) {
        return await this.service.get(uuid)
    }

    @Post()
    async create(@Body() body: CreateCompanyDTO) {
        return await this.service.create(body)
    }

    @Put(":uuid")
    @HttpCode(200)
    async update(
        @Param("uuid", ParseUUIDPipe) uuid: string,
        @Body() body: UpdateCompanyDTO,
    ) {
        return await this.service.update(uuid, body)
    }

    @Delete(":uuid")
    async remove(@Param("uuid", ParseUUIDPipe) uuid: string) {
        return await this.service.remove(uuid)
    }
}
