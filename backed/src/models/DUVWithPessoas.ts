// src/models/duvModel.ts
import { Types, Document } from 'mongoose';
import { Pessoa } from './pessoaModel'; // Certifique-se de importar o modelo de Pessoa
import { Navio } from './navioModel';   // **Importe também o modelo de Navio**

export interface DUV extends Document {
  numero: string;
  data_viagem: Date;
  navio: Types.ObjectId;  // Mantém a referência ao ObjectId de Navio
  lista_pessoas: Types.ObjectId[];  // Mantém a referência ao ObjectId das Pessoas
}

// Novo tipo para DUV com Pessoas e Navio associados (populados)
export interface DUVWithPessoas extends Omit<DUV, 'navio' | 'lista_pessoas'> {
  // As propriedades 'navio' e 'lista_pessoas' são omitidas da base DUV
  // para serem substituídas pelas suas versões populadas abaixo.
  pessoas: Pessoa[];  // Lista de objetos Pessoa
  navio: Navio;       // Objeto Navio completo
}