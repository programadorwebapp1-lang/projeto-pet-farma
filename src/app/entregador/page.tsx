'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  Alert,
  AppBar,
  Toolbar,
  Avatar,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MapIcon from '@mui/icons-material/Map';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import api from '../../service/api';

/* ---------- Leaflet Config ---------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

/* ---------- Types ---------- */
interface Colaborador {
  ID: number;
  NOME: string;
  CPF: string;
  TELEFONE: string;
  CARGO: string;
}

interface Order {
  id: number;
  clientName: string;
  product: string;
  status: 'pending' | 'accepted';
  clientAddress: string;
  clientCoords?: { latitude: number; longitude: number };
}

/* ---------- GEO: Busca Coordenadas ---------- */
async function geocodeAddress({ RUA, NUMERO, BAIRRO }: any) {
  const address = `${RUA} ${NUMERO}, Rio Branco, Acre, Brasil`;

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'DeliveryApp/1.0' }
  });

  const data = await res.json();

  if (!data || data.length === 0) return null;

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon)
  };
}

/* ---------- Converte JSON da API → Ordem ---------- */
async function transformApiOrders(apiData: any[]) {
  const result: Order[] = [];

  for (const item of apiData) {
    const coords = await geocodeAddress(item);

    result.push({
      id: item.ID,
      product: 'Item do Pedido',
      clientName: item.NOME,
      status: 'pending',
      clientAddress: `${item.RUA}, ${item.NUMERO}, ${item.BAIRRO}, Rio Branco - AC`,
      clientCoords: coords ?? undefined
    });
  }

  return result;
}

/* ---------- COMPONENTE PRINCIPAL ---------- */
const DeliveryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [acceptedOrder, setAcceptedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [entregadores, setEntregadores] = useState<Colaborador[]>([]);
  const [selectedEntregador, setSelectedEntregador] = useState<number | ''>('');
  const [loadingEntregadores, setLoadingEntregadores] = useState(true);

  /* ---------- CARREGA PEDIDOS COM GEO ---------- */
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get('/compras/');
        const lista = res.data.data;

        const converted = await transformApiOrders(lista);
        setOrders(converted);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar pedidos.');
      }
    };

    loadOrders();
  }, []);

  /* ---------- CARREGA ENTREGADORES ---------- */
  useEffect(() => {
    const fetchEntregadores = async () => {
      try {
        const res = await api.get('/colaboradores/');
        const lista: Colaborador[] = res.data.data || [];

        const entregadoresFiltrados = lista.filter(
          (c) => c.CARGO.trim().toLowerCase() === 'entregador'
        );

        setEntregadores(entregadoresFiltrados);
      } catch {
        setError('Erro ao buscar entregadores.');
      } finally {
        setLoadingEntregadores(false);
      }
    };

    fetchEntregadores();
  }, []);

  /* ---------- ACEITAR ENTREGA COM GEO ---------- */
  const acceptDeliveryWithGeo = (orderId: number) => {
    if (!selectedEntregador) return setError('Selecione um entregador.');

    if (!navigator.geolocation)
      return setError('Seu navegador não suporta geolocalização.');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation(pos);

        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: 'accepted' } : o
          )
        );

        const current = orders.find((o) => o.id === orderId) ?? null;
        setAcceptedOrder(current);

        setError(null);
      },
      (err) => setError('Erro ao obter localização: ' + err.message),
      { enableHighAccuracy: true }
    );
  };

  const pendingOrders = orders.filter((o) => o.status === 'pending');

  /* ---------- CENTRALIZA MAPA ---------- */
  const getMapCenter = () => {
    if (!location || !acceptedOrder?.clientCoords)
      return [-9.97499, -67.8243]; // centro Rio Branco

    const lat =
      (location.coords.latitude + acceptedOrder.clientCoords.latitude) / 2;
    const lng =
      (location.coords.longitude + acceptedOrder.clientCoords.longitude) / 2;

    return [lat, lng];
  };

  return (
    <Box sx={{ bgcolor: '#f6f8fa', minHeight: '100vh' }}>
      {/* HEADER */}
      <AppBar position="static" elevation={2} sx={{ bgcolor: '#05344a' }}>
        <Toolbar>
          <Avatar sx={{ bgcolor: '#FFA500', mr: 2 }}>
            <LocalShippingIcon sx={{ color: '#05344a' }} />
          </Avatar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Painel do Entregador
          </Typography>
          <Chip icon={<MapIcon />} label="Online" color="success" />
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
        {/* SELECT ENTREGADOR */}
        {loadingEntregadores ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Carregando entregadores...
          </Alert>
        ) : entregadores.length === 0 ? (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Nenhum entregador cadastrado.
          </Alert>
        ) : (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="entregador-label">Selecione o Entregador</InputLabel>
            <Select
              labelId="entregador-label"
              value={selectedEntregador}
              label="Selecione o Entregador"
              onChange={(e) => setSelectedEntregador(e.target.value as number)}
            >
              {entregadores.map((e) => (
                <MenuItem key={e.ID} value={e.ID}>
                  {e.NOME} (CPF: {e.CPF})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* LISTA DE PEDIDOS */}
        {pendingOrders.map((order) => (
          <Card
            key={order.id}
            sx={{
              mb: 3,
              borderLeft: '8px solid #FFA500',
              borderRadius: 2,
              boxShadow: 2
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Pedido #{order.id}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography>{order.clientName}</Typography>
              </Box>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => acceptDeliveryWithGeo(order.id)}
                  disabled={!selectedEntregador}
                  startIcon={<CheckCircleIcon />}
                >
                  Aceitar Entrega
                </Button>

                <Button
                  variant="contained"
                  onClick={() => acceptDeliveryWithGeo(order.id)}
                  disabled={!selectedEntregador}
                  startIcon={<LocationOnIcon />}
                  sx={{ bgcolor: '#FFA500', color: '#000' }}
                >
                  Aceitar com Geolocalização
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {/* ENTREGA ACEITA */}
        {acceptedOrder && (
          <Box
            sx={{
              mt: 5,
              p: 3,
              borderRadius: 3,
              border: '2px solid #FFA500',
              bgcolor: '#fff',
              boxShadow: 2
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              Entrega Aceita ✔
            </Typography>

            <Typography>
              Cliente: <strong>{acceptedOrder.clientName}</strong>
            </Typography>
            <Typography sx={{ mb: 2 }}>
              Endereço: {acceptedOrder.clientAddress}
            </Typography>

            {location && acceptedOrder.clientCoords && (
              <Box sx={{ height: 350, mt: 3 }}>
                <MapContainer
                  center={getMapCenter()}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={[
                      location.coords.latitude,
                      location.coords.longitude
                    ]}
                  >
                    <Popup>Sua localização</Popup>
                  </Marker>

                  <Marker
                    position={[
                      acceptedOrder.clientCoords.latitude,
                      acceptedOrder.clientCoords.longitude
                    ]}
                  >
                    <Popup>Cliente</Popup>
                  </Marker>
                </MapContainer>
              </Box>
            )}
          </Box>
        )}

        {error && <Alert severity="error">{error}</Alert>}
      </Box>
    </Box>
  );
};

export default DeliveryPage;
