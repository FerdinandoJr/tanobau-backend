import { Body, Controller, Get, HttpCode, Param, Post } from "@nestjs/common"

import { Auth } from "core/http/decorators/auth.decorator"
import { SefazService } from "./sefaz.service"
import { SyncNFeDTO } from "./dto/sync-nfe.dto"
import { UF } from "core/valueObjects/uf.enum"

@Auth()
@Controller("sefaz")
export class SefazController {
    constructor(private service: SefazService) { }

    /**
     * Sincroniza NFes de uma UF específica
     */
    @Post("sync/:uf")
    @HttpCode(200)
    async syncByUF(@Param("uf") uf: UF) {
        return await this.service.syncByUF(uf)
    }

    /**
     * Sincroniza todas as UFs ativas
     */
    @Post("sync")
    @HttpCode(200)
    async syncAll() {
        return await this.service.syncAll()
    }

    /**
     * Endpoint de teste para verificar se o módulo está funcionando
     */
    @Get("health")
    async health() {
        return {
            status: "ok",
            message: "SEFAZ sync module is running",
            timestamp: new Date().toISOString()
        }
    }
}
