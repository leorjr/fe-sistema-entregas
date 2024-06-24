import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
      navigate('/'); // Redireciona para a listagem após o cadastro
    } catch (error) {
      console.error('Erro ao criar entrega:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
      </div>
      <div>
        <label>Data:</label>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} required />
      </div>
      <div>
        <label>Partida (Lat):</label>
        <input type="text" value={partida.lat} onChange={(e) => setPartida({ ...partida, lat: e.target.value })} required />
        <label>Partida (Long):</label>
        <input type="text" value={partida.long} onChange={(e) => setPartida({ ...partida, long: e.target.value })} required />
      </div>
      <div>
        <label>Destino (Lat):</label>
        <input type="text" value={destino.lat} onChange={(e) => setDestino({ ...destino, lat: e.target.value })} required />
        <label>Destino (Long):</label>
        <input type="text" value={destino.long} onChange={(e) => setDestino({ ...destino, long: e.target.value })} required />
      </div>
      <button type="submit">Cadastrar Entrega</button>
    </form>
  );
};

export default DeliveryForm;