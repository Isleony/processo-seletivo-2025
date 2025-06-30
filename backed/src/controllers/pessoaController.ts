import { Request, Response } from 'express';
import { Database } from '../services/database';
// Import Types for ObjectId conversion
import { Types } from 'mongoose';
// Import IPessoa and IDUV (the pure data interfaces) because DatabaseService returns these
import { IPessoa, IDUV } from '../models'; // Assuming these are exported from index.ts or pessoaModel/duvModel

export const getAllPessoas = async (req: Request, res: Response) => {
    try {
        // --- FIX 1: Await Database.getAllPessoas() ---
        const pessoas: IPessoa[] = await Database.getAllPessoas();
        return res.json(pessoas); // Added return
    } catch (error) {
        console.error('Error fetching pessoas:', error); // Added console.error
        return res.status(500).json({ message: 'Error fetching pessoas' }); // Added return
    }
};

export const getPessoaById = async (req: Request, res: Response) => {
    try {
        // --- FIX 2: Await Database.getPessoaById() ---
        const pessoa: IPessoa | undefined = await Database.getPessoaById(req.params.id);
        if (!pessoa) {
            return res.status(404).json({ message: 'Pessoa not found' });
        }
        return res.json(pessoa); // Added return
    } catch (error) {
        console.error('Error fetching pessoa by ID:', error); // Added console.error
        // --- FIX 3: Add error handling for invalid ObjectId format ---
        if (error instanceof Error && (error.message.includes('Cast to ObjectId failed') || error.message.includes('Argument passed in must be a string of 12 bytes or a string of 24 hex characters'))) {
            return res.status(400).json({ message: 'Invalid Pessoa ID format' });
        }
        return res.status(500).json({ message: 'Error fetching pessoa' }); // Added return
    }
};

export const createPessoa = async (req: Request, res: Response) => {
    try {
        // Prepare the data to conform to Omit<IPessoa, '_id'>
        // Make sure all required fields of IPessoa are present in req.body
        const pessoaData: Omit<IPessoa, '_id'> = {
            nome: req.body.nome,
            tipo: req.body.tipo,
            nacionalidade: req.body.nacionalidade, // Assuming these fields exist and are required
            foto: req.body.foto,                 // Adjust based on your IPessoa definition
            sid: req.body.tipo === 'passageiro' ? null : (req.body.sid || null) // Handle SID for tripulante/passageiro
        };

        // --- FIX 4: Validação para tripulantes (after preparing pessoaData) ---
        if (pessoaData.tipo === 'tripulante' && !pessoaData.sid) {
            return res.status(400).json({
                message: 'SID is required for tripulantes'
            });
        }
        
        // --- FIX 5: Use Database.createPessoa() and await it ---
        // Database.createPessoa returns IPessoa
        const newPessoa: IPessoa = await Database.createPessoa(pessoaData);
        return res.status(201).json(newPessoa); // Added return
    } catch (error) {
        console.error('Error creating pessoa:', error); // Added console.error
        // --- FIX 6: Add error handling for invalid ObjectId format (if relevant for references) ---
        if (error instanceof Error && (error.message.includes('Argument passed in must be a string of 12 bytes or a string of 24 hex characters'))) {
            return res.status(400).json({ message: 'Invalid ID format in request body' });
        }
        return res.status(400).json({ message: 'Error creating pessoa' }); // Added return
    }
};

export const updatePessoa = async (req: Request, res: Response) => {
    try {
        const pessoaId: string = req.params.id;

        // --- FIX 7: Use Database.updatePessoa() and await it ---
        // Prepare updateData to match Partial<Omit<IPessoa, '_id'>>
        const updateData: Partial<Omit<IPessoa, '_id'>> = { ...req.body };
        
        // Handle SID logic within the controller's updateData before passing
        // Make sure 'tipo' is correctly handled if it's being updated
        if (req.body.tipo === 'passageiro') {
            updateData.sid = null;
        } else if (req.body.tipo === 'tripulante') {
            // If updating to tripulante, ensure SID is present or preserve existing
            // You might need to fetch the current person to check currentPessoa.sid if not provided in req.body
            if (!req.body.sid) {
                const currentPessoa = await Database.getPessoaById(pessoaId); // Fetch current to get SID
                if (currentPessoa && currentPessoa.tipo === 'tripulante') {
                    updateData.sid = currentPessoa.sid; // Preserve old SID if not provided in request
                }
            }
        }

        const updatedPessoa: IPessoa | undefined = await Database.updatePessoa(pessoaId, updateData);

        if (!updatedPessoa) {
            return res.status(404).json({ message: 'Pessoa not found' });
        }

        return res.json(updatedPessoa); // Added return
    } catch (error) {
        console.error('Error updating pessoa:', error); // Added console.error
        // --- FIX 8: Add error handling for invalid ObjectId format ---
        if (error instanceof Error && (error.message.includes('Cast to ObjectId failed') || error.message.includes('Argument passed in must be a string of 12 bytes or a string of 24 hex characters'))) {
            return res.status(400).json({ message: 'Invalid Pessoa ID format' });
        }
        return res.status(400).json({ message: 'Error updating pessoa' }); // Added return
    }
};

export const deletePessoa = async (req: Request, res: Response) => {
    try {
        const pessoaId: string = req.params.id;

        // --- FIX 9: Use Database.deletePessoa() and await it ---
        // Database.deletePessoa handles the 'isUsed' check internally and returns boolean.
        const deleted = await Database.deletePessoa(pessoaId);

        if (!deleted) {
            // Database.deletePessoa returns false if not found or is in use.
            // You might want a more specific message from Database service to differentiate.
            return res.status(400).json({
                message: 'Cannot delete pessoa: not found or associated with one or more DUVs'
            });
        }

        return res.status(204).send(); // Added return
    } catch (error) {
        console.error('Error deleting pessoa:', error); // Added console.error
        // --- FIX 10: Add error handling for invalid ObjectId format ---
        if (error instanceof Error && (error.message.includes('Cast to ObjectId failed') || error.message.includes('Argument passed in must be a string of 12 bytes or a string of 24 hex characters'))) {
            return res.status(400).json({ message: 'Invalid Pessoa ID format' });
        }
        return res.status(500).json({ message: 'Error deleting pessoa' }); // Added return
    }
};