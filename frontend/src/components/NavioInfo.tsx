import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Navio } from '../types/models';

interface NavioInfoProps {
    navio: Navio;
}

const NavioInfo: React.FC<NavioInfoProps> = ({ navio }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
                src={navio.imagem}
                alt={navio.nome}
                sx={{ width: 120, height: 120 }}
                variant="rounded"
            />
            <Box>
                <Typography variant="h6" component="div">
                    {navio.nome}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Bandeira: {navio.bandeira}
                </Typography>
            </Box>
        </Box>
    );
};

export default NavioInfo;