import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getDeliveries } from '../services/deliveryService';
import { Entrega } from '../types/delivery';
import DeliveryModal from './DeliveryModal';

const DeliveryList: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Entrega[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Entrega | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await getDeliveries();
        if (response.data.success) {
          setDeliveries(response.data.data.entregas);
        }
      } catch (error) {
        console.error('Erro ao buscar entregas:', error);
      }
    };
    fetchDeliveries();
  }, []);

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lista de Entregas
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Partida (Lat)</TableCell>
                <TableCell>Partida (Long)</TableCell>
                <TableCell>Destino (Lat)</TableCell>
                <TableCell>Destino (Long)</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.id} hover onClick={() => setSelectedDelivery(delivery)}>
                  <TableCell>{delivery.id}</TableCell>
                  <TableCell>{delivery.nome}</TableCell>
                  <TableCell>{new Date(delivery.data).toLocaleDateString()}</TableCell>
                  <TableCell>{delivery.partida.lat}</TableCell>
                  <TableCell>{delivery.partida.long}</TableCell>
                  <TableCell>{delivery.destino.lat}</TableCell>
                  <TableCell>{delivery.destino.long}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setSelectedDelivery(delivery)}
                    >
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {selectedDelivery && (
          <DeliveryModal delivery={selectedDelivery} onClose={() => setSelectedDelivery(null)} />
        )}
      </Paper>
    </Container>
  );
};

export default DeliveryList;