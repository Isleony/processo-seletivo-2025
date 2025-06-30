import { Router } from 'express';
import {
    getAllPessoas,
    getPessoaById,
    createPessoa,
    updatePessoa,
    deletePessoa
} from '../controllers/pessoaController';

const router = Router();

router.get('/', getAllPessoas);
router.get('/:id', getPessoaById);
router.post('/', createPessoa);
router.put('/:id', updatePessoa);
router.delete('/:id', deletePessoa);

export default router;