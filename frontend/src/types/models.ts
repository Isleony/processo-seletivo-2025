export interface Pessoa{
    id: string;
    nome: string;
    tipo: 'tripulante'| 'passageiro';
    nacionalidade: string;
    sid: string | null;
    foto: string;
}

export interface Navio{
    id: string;
    nome: string;
    bandeira: string;
    imagem: string;
}


export interface DUV {
  _id: string;
  id: string;
  numero: string;
  data_viagem: string;
  lista_pessoas?: Pessoa[];
 navio: Navio;
 
}
