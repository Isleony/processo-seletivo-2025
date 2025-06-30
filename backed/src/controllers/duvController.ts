// src/controllers/duvController.ts
import { Request, Response } from 'express';
import { Database } from '../services/database';
// Importe IDUV, INavio, IPessoa para o que DatabaseService retorna
// E DUVWithPessoas para a resposta final
import { DUV, Navio, Pessoa, DUVWithPessoas, IDUV, INavio, IPessoa } from '../models'; // <--- Importante: DUV, Navio, Pessoa ainda serão usados para o retorno final do Express se você quiser simulá-los como Mongoose Docs.

import { Types } from 'mongoose';

// ---
// Função para obter todos os DUVs
// ---
export const getAllDUVs = async (req: Request, res: Response) => {
  try {
    // Agora Database.getAllDUVs retorna IDUV[]
    const duvs: IDUV[] = await Database.getAllDUVs();
    // Se você quer que a API retorne algo que pareça um DUV (Document),
    // você pode mapear aqui, mas DUVWithPessoas é a resposta principal.
    return res.json(duvs); // Retorna os dados puros (IDUV)
  } catch (error) {
    console.error('Error fetching all DUVs:', error);
    return res.status(500).json({ message: 'Error fetching DUVs' });
  }
};

// ---
// Função para obter DUV por ID
// ---
export const getDUVById = async (req: Request, res: Response) => {
  try {
    const duvId: string = req.params.id;

    // Database.getDUVById retorna IDUV (dado puro)
    const duv: IDUV | undefined = await Database.getDUVById(duvId);

    if (!duv) {
      return res.status(404).json({ message: 'DUV not found' });
    }

    // Database.getPessoasByDUV retorna IPessoa[] (dados puros)
    const pessoas: IPessoa[] = await Database.getPessoasByDUV(duv.lista_pessoas);
    // Database.getNavioById retorna INavio (dado puro)
    const navio: INavio | undefined = await Database.getNavioById(duv.navio);

    if (!navio) {
      return res.status(404).json({ message: 'Associated Navio not found' });
    }

    // Construir a resposta DUVWithPessoas
    // DUVWithPessoas omite 'navio' e 'lista_pessoas' de IDUV, e re-adiciona _id, id (string), pessoas (IPessoa[]), navio (INavio)
    const response: DUVWithPessoas = {
        _id: duv._id,
        id: duv._id.toString(), // Converter o _id para string para a propriedade 'id'
        numero: duv.numero,
        data_viagem: duv.data_viagem,
        pessoas: pessoas, // Já são IPessoa[]
        navio: navio,     // Já é INavio
        // Todas as outras propriedades de IDUV são incluídas por padrão se duv for spread antes.
        // Se houver mais propriedades em IDUV que não foram explicitamente listadas acima
        // e que DUVWithPessoas não omite, elas serão incluídas.
    };
    // Para ter certeza que todas as propriedades do IDUV são incluídas:
    const { navio: duvNavioId, lista_pessoas: duvListaPessoasIds, ...restOfIDUV } = duv;
    const finalResponse: DUVWithPessoas = {
        ...restOfIDUV, // Spreads numero, data_viagem, etc.
        _id: duv._id,
        id: duv._id.toString(),
        pessoas: pessoas,
        navio: navio,
    };


    return res.json(finalResponse);
  } catch (error) {
    console.error('Error fetching DUV by ID:', error);
    if (error instanceof Error && (error.message.includes('Cast to ObjectId failed') || error.message.includes('Argument passed in must be a string of 12 bytes or a string of 24 hex characters'))) {
      return res.status(400).json({ message: 'Invalid DUV ID format' });
    }
    return res.status(500).json({ message: 'Error fetching DUV' });
  }
};

// ---
// Função para criar um novo DUV
// ---
export const createDUV = async (req: Request, res: Response) => {
  try {
    // req.body.navio é string, precisa converter para Types.ObjectId para o Database.getNavioById
    const navioExists = await Database.getNavioById(new Types.ObjectId(req.body.navio));
    if (!navioExists) {
      return res.status(400).json({ message: 'Navio not found' });
    }

    const pessoasExist = await Promise.all(
      req.body.lista_pessoas.map(async (id: string) => await Database.getPessoaById(id))
    );
    const pessoasInvalidas = pessoasExist.some(p => !p);

    if (pessoasInvalidas) {
      return res.status(400).json({ message: 'One or more pessoas not found' });
    }

    // O objeto enviado para createDUV deve ser do tipo Omit<IDUV, '_id'>
    const duvToCreate: Omit<IDUV, '_id'> = {
      numero: req.body.numero,
      data_viagem: new Date(req.body.data_viagem),
      navio: new Types.ObjectId(req.body.navio), // Converte string para ObjectId
      lista_pessoas: req.body.lista_pessoas.map((id: string) => new Types.ObjectId(id)) // Converte strings para ObjectIds
    };

    // Database.createDUV retorna IDUV
    const newDUV: IDUV = await Database.createDUV(duvToCreate);
    // Se a resposta da API precisa ser um DUV (Document), você pode mapear aqui.
    // Ou, se a DUVWithPessoas é a resposta padrão para "obter DUV", considere retornar algo semelhante.
    // Para simplificar, vamos retornar o IDUV criado
    return res.status(201).json(newDUV);
  } catch (error) {
    console.error('Error creating DUV:', error);
    if (error instanceof Error && (error.message.includes('Argument passed in must be a string of 12 bytes or a string of 24 hex characters'))) {
      return res.status(400).json({ message: 'Invalid ID format in request body' });
    }
    return res.status(400).json({ message: 'Error creating DUV' });
  }
};

// ---
// Função para atualizar um DUV existente
// ---
export const updateDUV = async (req: Request, res: Response) => {
  try {
    const duvId: string = req.params.id;

    // O objeto enviado para updateDUV deve ser do tipo Partial<Omit<IDUV, '_id'>>
    const updateData: Partial<Omit<IDUV, '_id'>> = { ...req.body };
    if (req.body.navio && typeof req.body.navio === 'string') {
        (updateData as any).navio = new Types.ObjectId(req.body.navio);
    }
    if (req.body.lista_pessoas && Array.isArray(req.body.lista_pessoas)) {
        (updateData as any).lista_pessoas = req.body.lista_pessoas.map((id: string) => new Types.ObjectId(id));
    }

    // Database.updateDUV retorna IDUV
    const updatedDUV: IDUV | undefined = await Database.updateDUV(duvId, updateData);

    if (!updatedDUV) {
      return res.status(404).json({ message: 'DUV not found' });
    }

    return res.json(updatedDUV);
  } catch (error) {
    console.error('Error updating DUV:', error);
    if (error instanceof Error && (error.message.includes('Cast to ObjectId failed') || error.message.includes('Argument passed in must be a string of 12 bytes or a string of 24 hex characters'))) {
      return res.status(400).json({ message: 'Invalid ID format in request' });
    }
    return res.status(400).json({ message: 'Error updating DUV' });
  }
};

// ---
// Função para deletar um DUV
// ---
export const deleteDUV = async (req: Request, res: Response) => {
  try {
    const duvId: string = req.params.id;
    const deleted = await Database.deleteDUV(duvId);

    if (!deleted) {
      return res.status(404).json({ message: 'DUV not found' });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting DUV:', error);
    if (error instanceof Error && (error.message.includes('Cast to ObjectId failed') || error.message.includes('Argument passed in must be a string of 12 bytes or a string of 24 hex characters'))) {
      return res.status(400).json({ message: 'Invalid DUV ID format' });
    }
    return res.status(500).json({ message: 'Error deleting DUV' });
  }
};