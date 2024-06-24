import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DeliveryForm from './components/DeliveryForm';
import DeliveryList from './components/DeliveryList';
import { Entrega } from './types/delivery';

const App: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Entrega[]>([]);

  const handleDeliveryCreated = (newDelivery: Entrega) => {
    setDeliveries((prevDeliveries) => [...prevDeliveries, newDelivery]);
  };

  return (
    <Router>
      <div>
        <h1>Gestão de Entregas</h1>
        <Routes>
          <Route path="/create" element={<DeliveryForm onDeliveryCreated={handleDeliveryCreated} />} />
          <Route path="/" element={<DeliveryList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;