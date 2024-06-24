import axios from 'axios';
import { CreateEntregaRequest, Entrega } from '../types/delivery';

const API_URL = 'http://localhost:3000/api'; // Certifique-se de que esta URL está correta

interface GetDeliveriesResponse {
  success: boolean;
  status: number;
  data: {
    entregas: Entrega[];
    count: number;
  };
}

export const getDeliveries = () => axios.get<GetDeliveriesResponse>(`${API_URL}/entregas`);
export const getDeliveryById = (id: number) => axios.get<Entrega>(`${API_URL}/entregas/${id}`);
export const createDelivery = (delivery: CreateEntregaRequest) => axios.post<Entrega>(`${API_URL}/entregas`, delivery);