import { IConfiguracaoSefaz } from "../entities/configuracao-sefaz"
import { UF } from "core/valueObjects/uf.enum"

export interface IConfiguracaoSefazRepository {
    findByUF(uf: UF): Promise<IConfiguracaoSefaz | null>
    findActive(): Promise<IConfiguracaoSefaz[]>
    findByUuid(uuid: string): Promise<IConfiguracaoSefaz | null>
    create(config: IConfiguracaoSefaz): Promise<IConfiguracaoSefaz>
    update(uuid: string, data: Partial<IConfiguracaoSefaz>): Promise<IConfiguracaoSefaz>
    delete(uuid: string): Promise<void>
}
