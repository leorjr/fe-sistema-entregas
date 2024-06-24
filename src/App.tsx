import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DeliveryForm from './components/DeliveryForm';
import DeliveryList from './components/DeliveryList';
import Navbar from './components/Navbar';
import { Entrega } from './types/delivery';

const App: React.FC = () => {
  const [, setDeliveries] = useState<Entrega[]>([]);

  const handleDeliveryCreated = (newDelivery: Entrega) => {
    setDeliveries((prevDeliveries) => [...prevDeliveries, newDelivery]);
  };

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/create" element={<DeliveryForm onDeliveryCreated={handleDeliveryCreated} />} />
          <Route path="/" element={<DeliveryList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;