import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from "@nestjs/common";
import { QueryFailedError } from "typeorm";

type PostgresDriverError = {
  code?: string;        // 23505, 23503, 23502, 23514
  detail?: string;
  table?: string;
  constraint?: string;
  column?: string;
};

function extractUniqueValue(detail?: string): string | null {
  // PT-BR costuma vir: 'Chave (value)=(7908...) já existe.'
  // EN costuma vir: 'Key (value)=(...) already exists.'
  if (!detail) return null;

  const m1 = detail.match(/\(value\)=\((.+?)\)/); // pega o value quando a coluna é "value"
  if (m1?.[1]) return m1[1];

  const m2 = detail.match(/\(([^)]+)\)=\((.+?)\)/); // pega (col)=(val)
  return m2?.[2] ?? null;
}

export function throwHttpFromPgError(err: unknown): never {
  if (!(err instanceof QueryFailedError)) {
    throw err;
  }

  const pg = (err as any)?.driverError as PostgresDriverError | undefined;
  const code = pg?.code;

  switch (code) {
    case "23505": {
      // unique_violation
      const duplicated = extractUniqueValue(pg?.detail);
      const target = pg?.table ?? pg?.constraint ?? "registro";
        console.log(`Violação de unicidade em ${target}${duplicated ? `: ${duplicated}` : ""}.`)
      throw new ConflictException(
        duplicated
          ? `Valor duplicado em ${target}: ${duplicated}.`
          : `Violação de unicidade em ${target}.`
      );
    }

    case "23503": {
      // foreign_key_violation
      // Ex: tentando apagar/insert com FK inválida
      const target = pg?.constraint ?? pg?.table ?? "chave estrangeira";
      console.log(`Violação de chave estrangeira (${target}). Verifique referências antes de salvar/apagar.`)
      throw new BadRequestException(`Violação de chave estrangeira (${target}). Verifique referências antes de salvar/apagar.`);
    }

    case "23502": {
      // not_null_violation
      const col = pg?.column ?? "campo obrigatório";
      console.log(`O campo '${col}' é obrigatório.`)
      throw new BadRequestException(`O campo '${col}' é obrigatório.`);
    }

    case "23514": {
      // check_violation      
      const target = pg?.constraint ?? pg?.table ?? "regra de validação";
      console.log(`Violação de regra (CHECK): ${target}.`)
      throw new BadRequestException(`Violação de regra (CHECK): ${target}.`);
    }

    default:
        console.error(`Erro de banco de dados${code ? ` (code ${code})` : ""}.`);
      throw new InternalServerErrorException(
        `Erro de banco de dados${code ? ` (code ${code})` : ""}.`
      );
  }
}
