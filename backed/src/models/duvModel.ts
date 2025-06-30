// src/models/duvModel.ts
import { Types, Document } from 'mongoose';
import { Pessoa } from './pessoaModel'; // Certifique-se de importar o modelo de Pessoa
import { Navio } from './navioModel';   // Importe também o modelo de Navio

// Interface para o documento DUV como ele é armazenado no MongoDB
export interface DUV extends Document {
  numero: string;
  data_viagem: Date;
  navio: Types.ObjectId;           // Referência ao ObjectId de Navio
  lista_pessoas: Types.ObjectId[]; // Referência aos ObjectIds das Pessoas
  // Adicione outras propriedades do seu esquema DUV aqui, se houver
}

// Interface para o DUV COM suas referências populadas (Pessoas e Navio como objetos completos)
// Precisamos omitir as propriedades originais de referência (navio, lista_pessoas)
// E também as propriedades '_id' e 'id' do Document, para redefini-las com os tipos esperados
export interface DUVWithPessoas extends Omit<DUV, '_id' | 'id' | 'navio' | 'lista_pessoas'> {
  _id: Types.ObjectId; // _id é o ObjectId do Mongoose, crucial para o documento
  id: string;          // Mongoose também expõe uma propriedade 'id' como string
  pessoas: Pessoa[];   // Lista de objetos Pessoa populados
  navio: Navio;        // Objeto Navio populado
  // Todas as outras propriedades de DUV (numero, data_viagem, etc.) são herdadas
}