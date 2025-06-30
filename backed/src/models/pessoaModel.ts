import { Document, model, Schema } from 'mongoose';

export interface Pessoa extends Document {
    nome: string;
    tipo: 'tripulante' | 'passageiro';
    nacionalidade: string;
    sid: string | null;
    foto: string;
}

const pessoaSchema = new Schema<Pessoa>({
    nome: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        enum: ['tripulante', 'passageiro'],
        required: true
    },
    nacionalidade: {
        type: String,
        required: true
    },
    sid: {
        type: String,
        required: function () {
            return this.tipo === 'tripulante';
        },
        default: null
    },
    foto: {
        type: String,
        required: false
    }
});

export const PessoaModel = model<Pessoa>('Pessoa', pessoaSchema);
