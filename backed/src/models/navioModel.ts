import { Document, model, Schema } from 'mongoose';

export interface Navio extends Document {
    nome: string;
    bandeira: string;
    imagem: string;
}

const navioSchema = new Schema<Navio>({
    nome: {
        type: String,
        required: true
    },
    bandeira: {
        type: String,
        required: true
    },
    imagem: {
        type: String,
        required: false,
        default: '/default-ship.jpg' // Valor padrão caso a imagem não seja fornecida
    }
});

export const NavioModel = model<Navio>('Navio', navioSchema);
