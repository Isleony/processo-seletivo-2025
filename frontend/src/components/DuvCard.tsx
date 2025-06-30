import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DUV } from '../types/models';

interface DuvCardProps {
    duv: DUV;
}

const DuvCard: React.FC<DuvCardProps> = ({ duv }) => {
    const navigate = useNavigate();

    // Garantindo que navio esteja populado corretamente
    const navioNome = duv.navio?.nome ?? 'Desconhecido';
    const navioImagem = duv.navio?.imagem ?? '/default-ship.jpg';

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
                component="img"
                height="140"
                image={navioImagem}
                alt={navioNome}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                    DUV: {duv.numero}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Navio: {navioNome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Data: {new Date(duv.data_viagem).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Passageiros: {duv.lista_pessoas?.length ?? 0}
                </Typography>
            </CardContent>
            <Button
                size="small"
                color="primary"
                onClick={() => navigate(`/duvs/${duv._id ?? duv.id}`)}
                sx={{ m: 1 }}
            >
                Ver Detalhes
            </Button>
        </Card>
    );
};

export default DuvCard;
