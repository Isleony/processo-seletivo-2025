import { Request, Response } from 'express';
import { Database } from '../services/database';
// Import Types for ObjectId conversion
import { Types } from 'mongoose';
// Import INavio and IDUV (the pure data interfaces) because DatabaseService returns these
import { INavio, IDUV } from '../models'; // Assuming these are exported from index.ts or navioModel/duvModel

// Function to get all Navios
export const getAllNavios = async (req: Request, res: Response) => {
  try {
    // Await the async call to getAllNavios
    const navios: INavio[] = await Database.getAllNavios();
    return res.json(navios);
  } catch (error) {
    console.error('Error fetching navios:', error);
    return res.status(500).json({ message: 'Error fetching navios' });
  }
};

// Function to get Navio by ID
export const getNavioById = async (req: Request, res: Response) => {
  try {
    const navioId: string = req.params.id;

    // --- FIX 1: Convert string ID to ObjectId for Database.getNavioById ---
    // Await the async call
    const navio: INavio | undefined = await Database.getNavioById(new Types.ObjectId(navioId));

    if (!navio) {
      return res.status(404).json({ message: 'Navio not found' });
    }

    return res.json(navio);
  } catch (error) {
    console.error('Error fetching navio by ID:', error);
    // Add specific check for invalid ObjectId format
    if (error instanceof Error && (error.message.includes('Cast to ObjectId failed') || error.message.includes('Argument passed in must be a string of 12 bytes or a string of 24 hex characters'))) {
      return res.status(400).json({ message: 'Invalid Navio ID format' });
    }
    return res.status(500).json({ message: 'Error fetching navio' });
  }
};

// Function to create a new Navio
export const createNavio = async (req: Request, res: Response) => {
  try {
    // --- FIX 2: Await getAllNavios and explicitly type parameter 'n' ---
    // If you want to check for existing navio by name, first await getAllNavios
    const allNavios: INavio[] = await Database.getAllNavios();
    const navioExists = allNavios.some((n: INavio) => n.nome === req.body.nome);

    if (navioExists) {
      return res.status(400).json({ message: 'Navio with this name already exists' });
    }

    // Database.createNavio expects Omit<INavio, '_id'>
    const navioData: Omit<INavio, '_id'> = {
        nome: req.body.nome,
        bandeira: req.body.bandeira, // Assuming these fields are in req.body
        imagem: req.body.imagem,
        // Add any other required fields from INavio here
    };

    // Await the async call
    const newNavio: INavio = await Database.createNavio(navioData);
    return res.status(201).json(newNavio);
  } catch (error) {
    console.error('Error creating navio:', error);
    return res.status(400).json({ message: 'Error creating navio' });
  }
};

// Function to update an existing Navio
export const updateNavio = async (req: Request, res: Response) => {
  try {
    const navioId: string = req.params.id;

    // --- FIX 3: Await getAllNavios and get the specific navio ---
    // If you need to access properties of the array, you must await it first.
    // Also, use Database.updateNavio directly which handles the internal find.
    const updateData: Partial<Omit<INavio, '_id'>> = req.body; // Data to update with

    // Await the async call
    const updatedNavio: INavio | undefined = await Database.updateNavio(navioId, updateData);

    if (!updatedNavio) {
      return res.status(404).json({ message: 'Navio not found' });
    }

    return res.json(updatedNavio);
  } catch (error) {
    console.error('Error updating navio:', error);
    // Add specific check for invalid ObjectId format
    if (error instanceof Error && (error.message.includes('Cast to ObjectId failed') || error.message.includes('Argument passed in must be a string of 12 bytes or a string of 24 hex characters'))) {
      return res.status(400).json({ message: 'Invalid Navio ID format' });
    }
    return res.status(400).json({ message: 'Error updating navio' });
  }
};

// Function to delete a Navio
export const deleteNavio = async (req: Request, res: Response) => {
  try {
    const navioId: string = req.params.id;

    // --- FIX 4: Await getAllDUVs and use its result ---
    // Database.deleteNavio handles the 'isUsed' check internally.
    const deleted = await Database.deleteNavio(navioId);

    if (!deleted) {
      // If deleteNavio returns false, it means it's either not found or in use.
      // Database.deleteNavio already has the 'isUsed' check.
      // So if it returns false, it implies either not found or it was used.
      // Let's assume if it returns false, it was likely due to being in use or not found.
      // The Database.ts already returns false if isUsed.
      // You might want a more specific error message from Database.ts for "in use".
      return res.status(400).json({ message: 'Navio not found or is currently in use by a DUV.' });
    }

    return res.status(204).send(); // 204 No Content for successful deletion
  } catch (error) {
    console.error('Error deleting navio:', error);
    // Add specific check for invalid ObjectId format
    if (error instanceof Error && (error.message.includes('Cast to ObjectId failed') || error.message.includes('Argument passed in must be a string of 12 bytes or a string of 24 hex characters'))) {
      return res.status(400).json({ message: 'Invalid Navio ID format' });
    }
    return res.status(500).json({ message: 'Error deleting navio' });
  }
};