import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseIntPipe, ParseUUIDPipe, Post, Put, Query } from "@nestjs/common"

import { UserSortBy, UserUtils } from "./data/utils/user.utils"
import { CreateUserDTO } from "./dto/create.user.dto"
import { UpdateUserDTO } from "./dto/update.user.dto"
import { UserService } from "./user.service"

import { Auth } from "core/http/decorators/auth.decorator"
import { SortByPipe } from "core/http/pipes/sortBy.pipe"
import { SortDir, SortDirPipe } from "core/http/pipes/sortDir.pipe"


@Auth()
@Controller('users')
export class UserController {
  constructor(private service: UserService) { }

  @Get()
  async findAll(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('start', new DefaultValuePipe(0), ParseIntPipe) start: number,
    @Query('sortDir', new SortDirPipe()) sortDir: SortDir,
    @Query('sortBy', new SortByPipe<UserSortBy>("id", UserUtils.SORTABLE_FIELDS)) sortBy: UserSortBy,
    @Query('q') q?: string
  ) {
    return await this.service.list({ q, sortBy, sortDir, limit, start: start })
  }

  @Get(':uuid')
  async findOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return await this.service.get(uuid)
  }

  @Post()
  async create(@Body() body: CreateUserDTO) {
    return await this.service.create(body)
  }

  @Put(':uuid')
  @HttpCode(200)
  async update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() body: UpdateUserDTO
  ) {
    return await this.service.update(uuid, body)
  }

  @Delete(':uuid')
  async remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return await this.service.remove(uuid)
  }
}
