import express from 'express';
import cors from 'cors';
import duvRouter from './routes/duvRoutes';
import navioRouter from './routes/navioRoutes';
import pessoaRouter from './routes/pessoaRoutes';
import { Database } from './services/database';

import fs from 'fs';
import path from 'path';
// Import ALL your model interfaces, especially the pure data ones (IDUV, INavio, IPessoa)
// and Types for ObjectId conversion.
import { IDUV, INavio, IPessoa, DUV, Navio, Pessoa } from './models'; // <--- ADJUSTED IMPORT
import { Types } from 'mongoose'; // <--- IMPORT Mongoose Types

const app = express();
const PORT = 3001;

// Caminho absoluto para o mock.json no frontend/public
const mockPath = path.resolve(__dirname, '../../frontend/public/mock.json');

// Lê e faz parse do JSON
const mockRaw = fs.readFileSync(mockPath, 'utf-8');
const mockData = JSON.parse(mockRaw);

// --- CORREÇÃO AQUI ---
// Tipagem dos dados brutos do JSON para uma estrutura que podemos processar.
// Assumimos que o mock.json pode ter IDs como strings.
interface RawMockDUV {
  _id: string; // ID pode vir como string do JSON
  numero: string;
  data_viagem: string; // Data pode vir como string
  navio: RawMockNavio; // Navio como objeto aninhado
  lista_pessoas: RawMockPessoa[]; // Pessoas como array de objetos
}

interface RawMockNavio {
  _id: string; // ID pode vir como string do JSON
  nome: string;
  bandeira: string;
  imagem: string;
}

interface RawMockPessoa {
  _id: string; // ID pode vir como string do JSON
  nome: string;
  tipo: 'tripulante' | 'passageiro';
  sid: string | null;
  nacionalidade: string;
  foto: string;
}

// Tipagem explícita de mockData para refletir o JSON bruto
interface RawMockData {
  duvs: RawMockDUV[];
  pessoas: RawMockPessoa[];
  // Se mock.json tiver uma lista separada de navios, adicione aqui:
  // navios?: RawMockNavio[];
}

const rawMockData: RawMockData = mockData; // Cast do JSON parseado para o tipo bruto

// Processar os dados brutos do mock.json para os tipos de dados puros (I...)
// Convertendo IDs de string para Types.ObjectId e garantindo que os objetos estão no formato correto.

// Processar pessoas
const processedPessoas: IPessoa[] = rawMockData.pessoas.map(rawPessoa => ({
  _id: new Types.ObjectId(rawPessoa._id),
  nome: rawPessoa.nome,
  tipo: rawPessoa.tipo,
  sid: rawPessoa.sid,
  nacionalidade: rawPessoa.nacionalidade,
  foto: rawPessoa.foto,
}));

// Processar navios (assumindo que estão aninhados em DUVs ou se tiverem uma lista separada)
// Se 'navio' dentro de DUVs já é um objeto completo no mock.json:
const uniqueNaviosMap = new Map<string, INavio>();
rawMockData.duvs.forEach(rawDuv => {
  const rawNavio = rawDuv.navio;
  if (rawNavio && !uniqueNaviosMap.has(rawNavio._id)) {
    uniqueNaviosMap.set(rawNavio._id, {
      _id: new Types.ObjectId(rawNavio._id),
      nome: rawNavio.nome,
      bandeira: rawNavio.bandeira,
      imagem: rawNavio.imagem,
    });
  }
});
const processedNavios: INavio[] = Array.from(uniqueNaviosMap.values());

// Processar DUVs
const processedDuvs: IDUV[] = rawMockData.duvs.map(rawDuv => ({
  _id: new Types.ObjectId(rawDuv._id),
  numero: rawDuv.numero,
  data_viagem: new Date(rawDuv.data_viagem), // Converter string da data para Date
  navio: new Types.ObjectId(rawDuv.navio._id), // Referência ao _id do navio
  lista_pessoas: rawDuv.lista_pessoas.map(p => new Types.ObjectId(p._id)), // Referências aos _id das pessoas
}));


// Inicializa o banco de dados com os dados processados (I...)
Database.initialize({
  duvs: processedDuvs,
  navios: processedNavios,
  pessoas: processedPessoas
});

app.use(cors());
app.use(express.json());

app.use('/api/duvs', duvRouter);
app.use('/api/navios', navioRouter);
app.use('/api/pessoas', pessoaRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});