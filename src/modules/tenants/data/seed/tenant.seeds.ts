import { DataSource } from "typeorm"
import { IUser } from "modules/users/domain/entities/user"

export async function seedTenantData(tenantDs: DataSource, user: IUser) {
  // Iniciamos a transação global
  await tenantDs.transaction(async (manager) => {

    // 1. Seeds que não dependem da empresa (Configurações globais do Tenant)
    // 2. Criação da Empresa (Matriz)

    console.log(`Tenant seeded successfully`)
  })
}
