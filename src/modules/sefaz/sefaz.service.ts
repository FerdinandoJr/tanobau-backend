import { Injectable } from "@nestjs/common"
import { NFeSyncService, SyncResult } from "./services/nfe-sync.service"
import { UF } from "core/valueObjects/uf.enum"

@Injectable()
export class SefazService {
    constructor(private syncService: NFeSyncService) { }

    async syncByUF(uf: UF): Promise<SyncResult> {
        return await this.syncService.syncByUF(uf)
    }

    async syncAll(): Promise<SyncResult[]> {
        return await this.syncService.syncAll()
    }
}
