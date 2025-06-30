// src/models/index.ts (This file aggregates all your model interfaces)

import { Types, Document, Model } from 'mongoose'; // Import Model from mongoose

// --- 1. Schema Interfaces (Pure Data) ---
// These define the structure of the data as it would be stored in MongoDB.
// They explicitly include `_id` here for clarity, though Mongoose adds it.

export interface IPessoa {
  _id: Types.ObjectId;
  nome: string;
  tipo: 'tripulante' | 'passageiro';
  sid: string | null;
  nacionalidade: string;
  foto: string;
  // Add other properties of Pessoa schema here
}

export interface INavio {
  _id: Types.ObjectId;
  nome: string;
  bandeira: string;
  imagem: string;
  // Add other properties of Navio schema here
}

export interface IDUV {
  _id: Types.ObjectId;
  numero: string;
  data_viagem: Date;
  navio: Types.ObjectId;           // Reference to Navio's _id
  lista_pessoas: Types.ObjectId[]; // Array of Pessoa _ids
  // Add other properties of DUV schema here
}


// --- 2. Document Interfaces (What Mongoose model instances return) ---
// These interfaces extend the pure data interfaces (IPessoa, INavio, IDUV)
// and Mongoose's `Document` type. This is the type that Mongoose operations
// (like .find(), .save()) will typically return.
// Mongoose's Document already has _id and provides an 'id' getter.

export interface Pessoa extends IPessoa {} // Pessoa is now just IPessoa, but when used with Mongoose.model,
                                        // it implicitly gets Document properties.
                                        // We will correctly type the return of Mongoose models.

export interface Navio extends INavio {} // Same for Navio

export interface DUV extends IDUV {
  id: string | undefined;
}     // Same for DUV


// --- 3. DUVWithPessoas Interface (for populated results) ---
// This interface defines the shape of a DUV document *after* population.
// It omits the original ObjectId references from IDUV, and explicitly includes
// the populated objects (INavio and IPessoa[]).
// Note: We're omitting '_id' and re-adding it, even though it's in IDUV. This
// is often done in populated types to control the exact shape and ensure consistency.
export interface DUVWithPessoas extends Omit<IDUV, 'navio' | 'lista_pessoas'> {
  _id: Types.ObjectId;
  id?: string; // Mongoose Document adds a string 'id' getter; it's optional for plain objects
  pessoas: IPessoa[];  // Populated array of pure Pessoa data
  navio: INavio;       // Populated pure Navio data
  // Other properties like numero, data_viagem are inherited from IDUV
}


// --- Export Mongoose Model Types (for actual Mongoose setup, if you had one) ---
/*
// If you were to define actual Mongoose models, they'd look like this:
import { Schema, model } from 'mongoose';

const PessoaSchema = new Schema<IPessoa, PessoaModel>({
  nome: { type: String, required: true },
  tipo: { type: String, enum: ['tripulante', 'passageiro'], required: true },
  sid: { type: String },
  nacionalidade: { type: String, required: true },
  foto: { type: String, required: true },
});
export interface PessoaModel extends Model<IPessoa> {} // For static methods
export const PessoaModel = model<IPessoa, PessoaModel>('Pessoa', PessoaSchema);

// ... similar for Navio and DUV
*/