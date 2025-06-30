import { Router } from 'express';
import {
    getAllDUVs,
    getDUVById, // nome correto da função
    createDUV,
    updateDUV,
    deleteDUV
}  from '../controllers/duvController';

const router = Router();

// Rota para obter todos os DUVs
router.get('/', getAllDUVs);

// Rota para obter um DUV específico pelo ID
router.get('/:id', getDUVById);  // Corrigido para usar a função getDUVById

// Rota para criar um novo DUV
router.post('/', createDUV);

// Rota para atualizar um DUV existente
router.put('/:id', updateDUV);

// Rota para deletar um DUV
router.delete('/:id', deleteDUV);

export default router;
