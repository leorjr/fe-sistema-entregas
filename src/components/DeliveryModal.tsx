import React from 'react';
import Modal from 'react-modal';
import { Entrega } from '../types/delivery';

Modal.setAppElement('#root');

interface DeliveryModalProps {
  delivery: Entrega;
  onClose: () => void;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({ delivery, onClose }) => (
  <Modal isOpen={!!delivery} onRequestClose={onClose} contentLabel="Detalhes da Entrega">
    <h2>Detalhes da Entrega</h2>
    {delivery && (
      <div>
        <p><strong>ID:</strong> {delivery.id}</p>
        <p><strong>Nome:</strong> {delivery.nome}</p>
        <p><strong>Data:</strong> {new Date(delivery.data).toLocaleDateString()}</p>
        <p><strong>Partida:</strong> {delivery.partida.lat}, {delivery.partida.long}</p>
        <p><strong>Destino:</strong> {delivery.destino.lat}, {delivery.destino.long}</p>
      </div>
    )}
    <button onClick={onClose}>Fechar</button>
  </Modal>
);

export default DeliveryModal;