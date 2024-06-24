import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import { LineString, Point } from 'ol/geom';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import 'ol/ol.css';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { Icon, Stroke, Style } from 'ol/style';
import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { Entrega } from '../types/delivery';

Modal.setAppElement('#root');

interface DeliveryModalProps {
  delivery: Entrega | null;
  onClose: () => void;
}

const customStyles: ReactModal.Styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '50%',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    boxSizing: 'border-box' as React.CSSProperties['boxSizing'], // Ajuste aqui
  },
};

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100% - 60px)', // Deixa espaço para o título e botão
  marginTop: '20px',
};

const DeliveryModal: React.FC<DeliveryModalProps> = ({ delivery, onClose }) => {
  const [route, setRoute] = useState<number[][]>([]);
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<Map | null>(null);

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
      const data = response.data.routes[0].geometry.coordinates;
      setRoute(data);
    } catch (error) {
      console.error('Erro ao buscar rota:', error);
    }
  };

  useEffect(() => {
    if (mapRef.current && delivery) {
      const partidaCoords = fromLonLat([parseFloat(delivery.partida.long), parseFloat(delivery.partida.lat)]);
      const destinoCoords = fromLonLat([parseFloat(delivery.destino.long), parseFloat(delivery.destino.lat)]);

      const partidaFeature = new Feature({
        geometry: new Point(partidaCoords),
      });

      const destinoFeature = new Feature({
        geometry: new Point(destinoCoords),
      });

      partidaFeature.setStyle(
        new Style({
          image: new Icon({
            src: 'https://openlayers.org/en/latest/examples/data/icon.png',
            anchor: [0.5, 1],
          }),
        })
      );

      destinoFeature.setStyle(
        new Style({
          image: new Icon({
            src: 'https://openlayers.org/en/latest/examples/data/icon.png',
            anchor: [0.5, 1],
          }),
        })
      );

      const routeFeature = new Feature({
        geometry: new LineString(route.map(coord => fromLonLat([coord[0], coord[1]]))),
      });

      routeFeature.setStyle(
        new Style({
          stroke: new Stroke({
            color: '#0000FF',
            width: 3,
          }),
        })
      );

      const vectorSource = new VectorSource({
        features: [partidaFeature, destinoFeature, routeFeature],
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });

      const tileLayer = new TileLayer({
        source: new XYZ({
          url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        }),
      });

      mapInstanceRef.current = new Map({
        target: mapRef.current,
        layers: [tileLayer, vectorLayer],
        view: new View({
          center: partidaCoords,
          zoom: 13,
        }),
      });
    }
  }, [route, delivery]);

  const handleClose = () => {
    onClose();
    navigate('/'); // Redireciona para a listagem ao fechar o modal
  };

  return (
    <Modal isOpen={!!delivery} onRequestClose={handleClose} contentLabel="Detalhes da Entrega" style={customStyles}>
      <Typography variant="h5" component="h2" gutterBottom>
        {delivery ? `${delivery.nome.toUpperCase()} - ${new Date(delivery.data).toLocaleDateString()}` : ''}
      </Typography>
      {delivery && <div ref={mapRef} style={mapContainerStyle} />}
      <Box sx={{ textAlign: 'right', marginTop: '20px' }}>
        <Button onClick={handleClose} variant="contained" color="primary">
          Fechar
        </Button>
      </Box>
    </Modal>
  );
};

export default DeliveryModal;