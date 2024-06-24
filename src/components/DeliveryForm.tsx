import { Box, Button, Container, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { FormEvent, useState } from 'react';
import { createDelivery } from '../services/deliveryService';
import { Coordenadas, CreateEntregaRequest, Entrega } from '../types/delivery';

interface DeliveryFormProps {
  onDeliveryCreated: (delivery: Entrega) => void;
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ onDeliveryCreated }) => {
  const [nome, setNome] = useState<string>('');
  const [data, setData] = useState<string>('');
  const [partida, setPartida] = useState<Coordenadas>({ lat: '', long: '' });
  const [destino, setDestino] = useState<Coordenadas>({ lat: '', long: '' });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newDelivery: CreateEntregaRequest = { nome, data: new Date(data), partida, destino };
      const response = await createDelivery(newDelivery);
      onDeliveryCreated(response.data);
      setNome('');
      setData('');
      setPartida({ lat: '', long: '' });
      setDestino({ lat: '', long: '' });
    } catch (error) {
      console.error('Erro ao criar entrega:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cadastrar Entrega
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <TextField
            label="Data"
            type="date"
            variant="outlined"
            fullWidth
            margin="normal"
            value={data}
            onChange={(e) => setData(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Partida (Lat)"
                variant="outlined"
                fullWidth
                margin="normal"
                value={partida.lat}
                onChange={(e) => setPartida({ ...partida, lat: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Partida (Long)"
                variant="outlined"
                fullWidth
                margin="normal"
                value={partida.long}
                onChange={(e) => setPartida({ ...partida, long: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Destino (Lat)"
                variant="outlined"
                fullWidth
                margin="normal"
                value={destino.lat}
                onChange={(e) => setDestino({ ...destino, lat: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Destino (Long)"
                variant="outlined"
                fullWidth
                margin="normal"
                value={destino.long}
                onChange={(e) => setDestino({ ...destino, long: e.target.value })}
                required
              />
            </Grid>
          </Grid>
          <Box sx={{ marginTop: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Cadastrar Entrega
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DeliveryForm;