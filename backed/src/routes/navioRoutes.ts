import { Router } from 'express';


import {
    getAllNavios,
    getNavioById,
    createNavio,
    updateNavio,
    deleteNavio
} from '../controllers/navioController';

const router = Router();

router.get('/', getAllNavios);
router.get('/:id', getNavioById);
router.post('/', createNavio);
router.put('/:id', updateNavio);
router.delete('/:id', deleteNavio);


export default router;

