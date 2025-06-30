import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Button, Paper, Divider } from '@mui/material';
import NavioInfo from '../components/NavioInfo';
import PassageiroList from '../components/PassageiroList';
import { getDUVById } from '../services/api';
import { DUV } from '../types/models';
import { Pessoa } from '../types/models';


const DuvDetailPage: React.FC = () => {
const { id } = useParams<{ id: string }>();
const navigate = useNavigate();
const [duv, setDuv] = useState<DUV & { pessoas?: Pessoa[] } | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
const fetchData = async () => {
try {
const response = await getDUVById(id!);
setDuv(response.data);
} catch (err) {
setError('DUV não encontrada');
console.error(err);
} finally {
setLoading(false);
}
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await getDUVById(id!);
      console.log('🔍 DUV retornada da API:', response.data); // <-- Aqui!
      setDuv(response.data);
    } catch (err) {
      setError('DUV não encontrada');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [id]);

};

fetchData();
}, [id]);

if (loading) {
return (
<Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
<CircularProgress />
</Container>
);
}

if (error || !duv) {
return (
<Container sx={{ py: 4 }}>
<Typography color="error">{error || 'DUV não encontrada'}</Typography>
<Button onClick={() => navigate('/')} sx={{ mt: 2 }}>
Voltar para lista
</Button>
</Container>
);
}

return (
<Container maxWidth="lg" sx={{ py: 4 }}>
<Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
<Typography variant="h4" component="h1">
Detalhes da DUV: {duv.numero}
</Typography>
<Button variant="outlined" onClick={() => navigate('/')}>
Voltar
</Button>
</Box>

<Paper sx={{ p: 3, mb: 3 }}>
<Typography variant="h6" gutterBottom>
Informações da Viagem
</Typography>
<Typography variant="body1" sx={{ mb: 2 }}>
Data: {new Date(duv.data_viagem).toLocaleDateString()}
</Typography>

<Divider sx={{ my: 2 }} />

<NavioInfo navio={duv.navio} />
</Paper>

<Paper sx={{ p: 3 }}>
<Typography variant="h6" gutterBottom>
Passageiros e Tripulantes ({duv.pessoas?.length || 0})
</Typography>
{duv.pessoas ? (
<PassageiroList pessoas={duv.pessoas} />
) : (
<Typography>Carregando passageiros...</Typography>
)}
</Paper>
</Container>
);
};

export default DuvDetailPage;