import { ValueTransformer } from "typeorm";

export const documentoTransformer: ValueTransformer = {
  // Do código para o Banco (salva apenas números)
  to: (value: string | null) => {
    if (!value) return null;
    return value.replace(/\D/g, ''); // Remove pontos, barras e traços
  },
  // Do Banco para o código
  from: (value: string | null) => {
    return value; // Aqui você pode retornar a Value Object Documento(value)
  }
};