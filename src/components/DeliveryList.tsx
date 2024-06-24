import React, { useEffect, useState } from 'react';
import { getDeliveries } from '../services/deliveryService';
import { Entrega } from '../types/delivery';
import DeliveryModal from './DeliveryModal';

const DeliveryList: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Entrega[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Entrega | null>(null);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await getDeliveries();
        if (response.data.success) {
          setDeliveries(response.data.data.entregas);
          setCount(response.data.data.count);
        }
      } catch (error) {
        console.error('Erro ao buscar entregas:', error);
      }
    };
    fetchDeliveries();
  }, []);

  return (
    <div>
      <h2>Total de Entregas: {count}</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.id} onClick={() => setSelectedDelivery(delivery)}>
              <td>{delivery.id}</td>
              <td>{delivery.nome}</td>
              <td>{new Date(delivery.data).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedDelivery && (
        <DeliveryModal delivery={selectedDelivery} onClose={() => setSelectedDelivery(null)} />
      )}
    </div>
  );
};

export default DeliveryList;