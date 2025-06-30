import React from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Chip, Divider, Box } from '@mui/material';
import { Pessoa } from '../types/models';

interface PassageiroListProps {
    pessoas: Pessoa[];
}

const PassageiroList: React.FC<PassageiroListProps> = ({ pessoas }) => {
    const tripulantes = pessoas.filter(p => p.tipo === 'tripulante');
    const passageiros = pessoas.filter(p => p.tipo === 'passageiro');

    return (
        <Box>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Tripulantes ({tripulantes.length})
            </Typography>
            <List dense>
                {tripulantes.map((pessoa) => (
                    <React.Fragment key={pessoa.id}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar src={pessoa.foto} alt={pessoa.nome} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={pessoa.nome}
                                secondary={
                                    <>
                                        {pessoa.nacionalidade}
                                        {pessoa.sid && (
                                            <Chip
                                                label={`SID: ${pessoa.sid}`}
                                                color="primary"
                                                size="small"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>

            <Typography variant="subtitle1" sx={{ mt: 4, mb: 1 }}>
                Passageiros ({passageiros.length})
            </Typography>
            <List dense>
                {passageiros.map((pessoa) => (
                    <React.Fragment key={pessoa.id}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar src={pessoa.foto} alt={pessoa.nome} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={pessoa.nome}
                                secondary={pessoa.nacionalidade}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};

export default PassageiroList;