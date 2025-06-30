import { Types } from 'mongoose';
// Importe SOMENTE as interfaces de dados puros para o armazenamento interno
// e as interfaces Document-extended para os retornos onde Mongoose as usaria.
// Para o mock, focaremos nos tipos de dados puros para o armazenamento interno.
import { DUV, Navio, Pessoa, IDUV, INavio, IPessoa } from '../models'; // Verifique o caminho real de suas interfaces

class DatabaseService {
  // Armazene os dados internamente usando as interfaces de dados puros
  private duvs: IDUV[] = [];
  private navios: INavio[] = [];
  private pessoas: IPessoa[] = [];

  // --- DUVs ---
  // Retorna um array de IDUV (dados puros), não de DUV (Document)
  async getAllDUVs(): Promise<IDUV[]> {
    return [...this.duvs];
  }

  // Retorna um IDUV (dado puro), não um DUV (Document)
  async getDUVById(id: string): Promise<IDUV | undefined> {
    try {
      const objectId = new Types.ObjectId(id); // Converte a string para ObjectId
      return this.duvs.find(d => d._id.equals(objectId)); // Compara ObjectIds
    } catch (e) {
      console.error(`Error in getDUVById: Invalid ObjectId format for ID '${id}'`, e);
      return undefined;
    }
  }

  // duvData para criação agora espera Omit<IDUV, '_id'>
  async createDUV(duvData: Omit<IDUV, '_id'>): Promise<IDUV> {
      const newIDuv: IDUV = {
          _id: new Types.ObjectId(), // Gera um novo ObjectId
          ...duvData,
          // Certifica-se de que as refs são ObjectIds no IDUV, caso venham como string
          navio: duvData.navio instanceof Types.ObjectId ? duvData.navio : new Types.ObjectId(duvData.navio as any),
          lista_pessoas: duvData.lista_pessoas.map(pId => pId instanceof Types.ObjectId ? pId : new Types.ObjectId(pId as any))
      };
      this.duvs.push(newIDuv);
      return newIDuv; // Retorna IDUV (dado puro)
  }

  // Retorna um IDUV (dado puro), não um DUV (Document)
  async updateDUV(id: string, duvData: Partial<Omit<IDUV, '_id'>>): Promise<IDUV | undefined> {
    try {
      const objectId = new Types.ObjectId(id);
      const index = this.duvs.findIndex(d => d._id.equals(objectId));
      if (index === -1) return undefined;

      const currentDuv = this.duvs[index];
      const updatedIDuv = { ...currentDuv, ...duvData };

      if (duvData.navio && !(duvData.navio instanceof Types.ObjectId)) {
          (updatedIDuv as IDUV).navio = new Types.ObjectId(duvData.navio as any);
      }
      if (duvData.lista_pessoas) {
          (updatedIDuv as IDUV).lista_pessoas = duvData.lista_pessoas.map(pId => pId instanceof Types.ObjectId ? pId : new Types.ObjectId(pId as any));
      }

      this.duvs[index] = updatedIDuv;
      return updatedIDuv; // Retorna IDUV (dado puro)
    } catch (e) {
      console.error(`Error in updateDUV: Invalid ObjectId format for ID '${id}'`, e);
      return undefined;
    }
  }

  async deleteDUV(id: string): Promise<boolean> {
    try {
      const objectId = new Types.ObjectId(id);
      const initialLength = this.duvs.length;
      this.duvs = this.duvs.filter(d => !d._id.equals(objectId));
      return this.duvs.length !== initialLength;
    } catch (e) {
      console.error(`Error in deleteDUV: Invalid ObjectId format for ID '${id}'`, e);
      return false;
    }
  }

  // --- Navios ---
  async getAllNavios(): Promise<INavio[]> { // Retorna array de INavio (dado puro)
    return [...this.navios];
  }

  // Este método AGORA espera um Types.ObjectId (conforme duv.navio) e retorna INavio
  async getNavioById(id: Types.ObjectId): Promise<INavio | undefined> {
    const foundINavio = this.navios.find(n => n._id.equals(id));
    return foundINavio; // Retorna INavio (dado puro)
  }

  async createNavio(navioData: Omit<INavio, '_id'>): Promise<INavio> { // Retorna INavio (dado puro)
    const newINavio: INavio = {
      _id: new Types.ObjectId(),
      ...navioData
    };
    this.navios.push(newINavio);
    return newINavio;
  }

  async updateNavio(id: string, navioData: Partial<Omit<INavio, '_id'>>): Promise<INavio | undefined> { // Retorna INavio (dado puro)
    try {
      const objectId = new Types.ObjectId(id);
      const index = this.navios.findIndex(n => n._id.equals(objectId));
      if (index === -1) return undefined;

      const updatedINavio = { ...this.navios[index], ...navioData };
      this.navios[index] = updatedINavio;
      return updatedINavio;
    } catch (e) {
      console.error(`Error in updateNavio: Invalid ObjectId format for ID '${id}'`, e);
      return undefined;
    }
  }

  async deleteNavio(id: string): Promise<boolean> {
    try {
      const objectId = new Types.ObjectId(id);
      const isUsed = this.duvs.some(d => d.navio.equals(objectId));
      if (isUsed) return false;

      const initialLength = this.navios.length;
      this.navios = this.navios.filter(n => !n._id.equals(objectId));
      return this.navios.length !== initialLength;
    } catch (e) {
      console.error(`Error in deleteNavio: Invalid ObjectId format for ID '${id}'`, e);
      return false;
    }
  }

  // --- Pessoas ---
  async getAllPessoas(): Promise<IPessoa[]> { // Retorna array de IPessoa (dado puro)
    return [...this.pessoas];
  }

  async getPessoaById(id: string): Promise<IPessoa | undefined> { // Retorna IPessoa (dado puro)
    try {
      const objectId = new Types.ObjectId(id);
      const foundIPessoa = this.pessoas.find(p => p._id.equals(objectId));
      return foundIPessoa;
    } catch (e) {
      console.error(`Error in getPessoaById: Invalid ObjectId format for ID '${id}'`, e);
      return undefined;
    }
  }

  async createPessoa(pessoaData: Omit<IPessoa, '_id'>): Promise<IPessoa> { // Retorna IPessoa (dado puro)
    const newIPessoa: IPessoa = {
      _id: new Types.ObjectId(),
      ...pessoaData,
      sid: pessoaData.tipo === 'tripulante' ? pessoaData.sid || this.generateSid() : null
    };
    this.pessoas.push(newIPessoa);
    return newIPessoa;
  }

  async updatePessoa(id: string, pessoaData: Partial<Omit<IPessoa, '_id'>>): Promise<IPessoa | undefined> { // Retorna IPessoa (dado puro)
    try {
      const objectId = new Types.ObjectId(id);
      const index = this.pessoas.findIndex(p => p._id.equals(objectId));
      if (index === -1) return undefined;

      const currentIPessoa = this.pessoas[index];
      const updatedIPessoa = {
        ...currentIPessoa,
        ...pessoaData,
        sid:
          pessoaData.tipo === 'passageiro'
            ? null
            : pessoaData.sid || currentIPessoa.sid
      };

      this.pessoas[index] = updatedIPessoa;
      return updatedIPessoa;
    } catch (e) {
      console.error(`Error in updatePessoa: Invalid ObjectId format for ID '${id}'`, e);
      return undefined;
    }
  }

  async deletePessoa(id: string): Promise<boolean> {
    try {
      const objectId = new Types.ObjectId(id);
      const isUsed = this.duvs.some(d => d.lista_pessoas.some(pId => pId.equals(objectId)));
      if (isUsed) return false;

      const initialLength = this.pessoas.length;
      this.pessoas = this.pessoas.filter(p => !p._id.equals(objectId));
      return this.pessoas.length !== initialLength;
    } catch (e) {
      console.error(`Error in deletePessoa: Invalid ObjectId format for ID '${id}'`, e);
      return false;
    }
  }

  // --- Auxiliares ---
  // Este método AGORA espera um array de Types.ObjectId e retorna IPessoa[] (dados puros)
  async getPessoasByDUV(pessoaObjectIds: Types.ObjectId[]): Promise<IPessoa[]> {
    return pessoaObjectIds
      .map(id => this.pessoas.find(p => p._id.equals(id)))
      .filter((p): p is IPessoa => p !== undefined);
  }

  initialize(data: { duvs: IDUV[]; navios: INavio[]; pessoas: IPessoa[] }) {
    this.duvs = data.duvs;
    this.navios = data.navios;
    this.pessoas = data.pessoas;
  }

  private generateSid(): string {
    return 'SID' + Math.floor(10000 + Math.random() * 90000);
  }
}

export const Database = new DatabaseService();

// --- DADOS DUMMY ---
const dummyPessoa1Id = new Types.ObjectId();
const dummyPessoa2Id = new Types.ObjectId();
const dummyNavio1Id = new Types.ObjectId();
const dummyDUV1Id = new Types.ObjectId();


Database.initialize({
  pessoas: [
    { _id: dummyPessoa1Id, nome: 'Alice', tipo: 'tripulante', sid: 'SID12345', nacionalidade: 'Brazilian', foto: 'alice.jpg' },
    { _id: dummyPessoa2Id, nome: 'Bob', tipo: 'passageiro', sid: null, nacionalidade: 'American', foto: 'bob.jpg' },
  ],
  navios: [
    { _id: dummyNavio1Id, nome: 'Sea Princess', bandeira: 'Panama', imagem: 'sea_princess.jpg' },
  ],
  duvs: [
    {
      _id: dummyDUV1Id,
      numero: 'DUV001',
      data_viagem: new Date('2025-07-10'),
      navio: dummyNavio1Id,
      lista_pessoas: [dummyPessoa1Id, dummyPessoa2Id],
    },
  ],
});