import axios from 'axios';
import L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Polyline, TileLayer } from 'react-leaflet';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Entrega } from '../types/delivery';

Modal.setAppElement('#root');

interface DeliveryModalProps {
  delivery: Entrega | null;
  onClose: () => void;
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '80%',
    display: 'flex',
    flexDirection: 'row'
  },
};

const infoContainerStyle = {
  width: '50%',
  padding: '20px',
  overflowY: 'auto',
  boxSizing: 'border-box'
};

const mapContainerStyle = {
  width: '50%',
  height: '100%'
};

const DeliveryModal: React.FC<DeliveryModalProps> = ({ delivery, onClose }) => {
  const [route, setRoute] = useState<L.LatLngTuple[]>([]);
  const navigate = useNavigate();
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (delivery) {
      fetchRoute();
    }
  }, [delivery]);

  const fetchRoute = async () => {
    const start = `${delivery?.partida.long},${delivery?.partida.lat}`;
    const end = `${delivery?.destino.long},${delivery?.destino.lat}`;
    const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

    try {
      const response = await axios.get(url);
      const data = response.data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
      setRoute(data);
    } catch (error) {
      console.error('Erro ao buscar rota:', error);
    }
  };

  const handleClose = () => {
    onClose();
    navigate('/'); // Redireciona para a listagem ao fechar o modal
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, [delivery]);

  return (
    <Modal isOpen={!!delivery} onRequestClose={handleClose} contentLabel="Detalhes da Entrega" style={customStyles}>
      <div style={infoContainerStyle}>
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
        <button onClick={handleClose}>Fechar</button>
      </div>
      {delivery && (
        <div style={mapContainerStyle}>
          <MapContainer
            center={[parseFloat(delivery.partida.lat), parseFloat(delivery.partida.long)]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[parseFloat(delivery.partida.lat), parseFloat(delivery.partida.long)]} />
            <Marker position={[parseFloat(delivery.destino.lat), parseFloat(delivery.destino.long)]} />
            {route.length > 0 && <Polyline positions={route} color="blue" />}
          </MapContainer>
        </div>
      )}
    </Modal>
  );
};

export default DeliveryModal;