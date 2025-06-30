// src/services/api.ts

import axios from 'axios';
import { DUV, Pessoa } from '../types/models'; // Adicione esta linha para importar os tipos

const api = axios.create({
    baseURL: 'http://localhost:3001/api',
});

export const getDUVs = () => api.get<DUV[]>('/duvs');
export const getDUVById = (id: string) => api.get<DUV & { pessoas: Pessoa[] }>(`/duvs/${id}`);
export const createDUV = (duv: Omit<DUV, 'id'>) => api.post<DUV>('/duvs', duv);
export const updateDUV = (id: string, duv: Partial<DUV>) => api.put<DUV>(`/duvs/${id}`, duv);
export const deleteDUV = (id: string) => api.delete(`/duvs/${id}`);

// Métodos similares para Navio e Pessoa podem ser adicionados aqui

export default api;
