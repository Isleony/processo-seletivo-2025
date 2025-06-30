import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, CircularProgress } from '@mui/material';
import DuvCard from '../components/DuvCard';
import { getDUVs } from '../services/api';
import { DUV } from '../types/models';

const DuvListPage: React.FC = () => {
    const [duvs, setDuvs] = useState<DUV[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getDUVs();
                setDuvs(response.data);
            } catch (err) {
                setError('Falha ao carregar DUVs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Lista de DUVs
            </Typography>

            <Grid container spacing={3}>
                {duvs.map((duv) => (
                    <Grid item xs={12} sm={6} md={4} key={duv.id}>
                        <DuvCard duv={duv} />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default DuvListPage;