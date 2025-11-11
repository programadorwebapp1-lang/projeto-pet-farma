'use client';

import React, { useState, useMemo, useEffect } from 'react';
import api from '../../service/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, TextField, Typography, Card, CardContent, AppBar, Toolbar, Avatar, useMediaQuery } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import InfoIcon from '@mui/icons-material/Info';
import EventIcon from '@mui/icons-material/Event';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#FFA500', '#008000', '#000000', '#A52A2A', '#FFFFFF']; // laranja, verde, preto, marrom, branco

// Dados iniciais mock
// Inicialmente vazio, será populado pela API
const mockPets = [];

const PetPage = () => {
  const [pets, setPets] = useState(mockPets);
  // Buscar pets existentes na API ao carregar a página
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await api.get('/pets/');
        if (res.data && Array.isArray(res.data.data)) {
          // Mapeia campos do retorno para o formato usado na tela
          const petsApi = res.data.data.map((pet) => ({
            id: pet.ID,
            nome: pet.NOME,
            especie: pet.ESPECIE,
            raca: pet.RACA,
            endereço_dono: pet.ENDERECO_DONO,
            id_cliente: pet.CLIENTE_ID,
            // birthDate e idade não vêm da API, pode deixar vazio
            birthDate: '',
            idade: '',
          }));
          setPets(petsApi);
        }
      } catch (err) {
        setError('Erro ao buscar pets da API.');
      }
    };
    fetchPets();
  }, []);
  const [newPet, setNewPet] = useState({
    nome: '',
    especie: '',
    idade: '',
    raca: '',
    endereço_dono: '',
    id_cliente: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleAddPet = async () => {
    setError('');
    if (
      newPet.nome.trim() === '' ||
      newPet.especie.trim() === '' ||
      newPet.idade === '' ||
      newPet.raca.trim() === '' ||
      newPet.endereço_dono.trim() === '' ||
      newPet.id_cliente === ''
    ) {
      setError('Preencha todos os campos!');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        nome: newPet.nome,
        especie: newPet.especie,
        idade: Number(newPet.idade),
        raca: newPet.raca,
        endereço_dono: newPet.endereço_dono,
        id_cliente: Number(newPet.id_cliente),
      };
      const res = await api.post('/pets/Cadastrar_pet', payload);
      // Adiciona o novo pet à lista local
      setPets([
        ...pets,
        {
          id: pets.length + 1,
          nome: payload.nome,
          especie: payload.especie,
          idade: payload.idade,
          raca: payload.raca,
          endereço_dono: payload.endereço_dono,
          id_cliente: payload.id_cliente,
        },
      ]);
      setNewPet({
        nome: '',
        especie: '',
        idade: '',
        raca: '',
        endereço_dono: '',
        id_cliente: '',
      });
    } catch (err) {
      setError('Erro ao cadastrar pet.');
    }
    setLoading(false);
  };

  // Colunas da tabela
  const columns: GridColDef[] = [
    {
      field: 'nome',
      headerName: 'Nome',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#FFA500' }}>
          <PetsIcon />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'especie',
      headerName: 'Espécie',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#008000' }}>
          <InfoIcon />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'idade',
      headerName: 'Idade',
      flex: 0.7,
    },
    {
      field: 'raca',
      headerName: 'Raça',
      flex: 1,
    },
    {
      field: 'endereço_dono',
      headerName: 'Endereço do Dono',
      flex: 1.2,
    },
    {
      field: 'id_cliente',
      headerName: 'ID Cliente',
      flex: 0.7,
    },
    // ...campo 'birthDate' removido...
  ];

  // Gráfico: quantos pets por tipo
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    pets.forEach(({ especie }) => {
      counts[especie] = (counts[especie] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [pets]);

  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <Box sx={{ bgcolor: '#f6f8fa', minHeight: '100vh', fontFamily: 'Poppins, Roboto, sans-serif' }}>
      {/* AppBar fixo */}
      <AppBar position="static" elevation={2} sx={{ bgcolor: '#05344a', mb: 5 }}>
        <Toolbar>
          <Avatar sx={{ bgcolor: '#FFA500', mr: 2 }}>
            <PetsIcon sx={{ color: '#05344a' }} />
          </Avatar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1, }}>
            Gerenciar Pets
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 }, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 4 }}>
        {/* Formulário e gráfico */}
        <Box sx={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#008000', fontWeight: 'bold', mb: 2 }}>
                Cadastrar Pet
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Nome"
                  variant="outlined"
                  size="small"
                  value={newPet.nome}
                  onChange={(e) => setNewPet({ ...newPet, nome: e.target.value })}
                  sx={{ bgcolor: '#FFF' }}
                />
                <TextField
                  label="Espécie"
                  variant="outlined"
                  size="small"
                  value={newPet.especie}
                  onChange={(e) => setNewPet({ ...newPet, especie: e.target.value })}
                  sx={{ bgcolor: '#FFF' }}
                />
                <TextField
                  label="Idade"
                  variant="outlined"
                  size="small"
                  type="number"
                  value={newPet.idade}
                  onChange={(e) => setNewPet({ ...newPet, idade: e.target.value })}
                  sx={{ bgcolor: '#FFF' }}
                />
                <TextField
                  label="Raça"
                  variant="outlined"
                  size="small"
                  value={newPet.raca}
                  onChange={(e) => setNewPet({ ...newPet, raca: e.target.value })}
                  sx={{ bgcolor: '#FFF' }}
                />
                <TextField
                  label="Endereço do Dono"
                  variant="outlined"
                  size="small"
                  value={newPet.endereço_dono}
                  onChange={(e) => setNewPet({ ...newPet, endereço_dono: e.target.value })}
                  sx={{ bgcolor: '#FFF' }}
                />
                <TextField
                  label="ID Cliente"
                  variant="outlined"
                  size="small"
                  type="number"
                  value={newPet.id_cliente}
                  onChange={(e) => setNewPet({ ...newPet, id_cliente: e.target.value })}
                  sx={{ bgcolor: '#FFF' }}
                />
                {/* Campo 'Data de Nascimento' removido */}
                {error && (
                  <Typography color="error" fontSize={14}>{error}</Typography>
                )}
                <Button variant="contained" onClick={handleAddPet} disabled={loading} sx={{ bgcolor: '#FFA500', color: '#000', fontWeight: 'bold', borderRadius: 2, mt: 1, fontSize: 16, py: 1.2, boxShadow: 2 }}>
                  {loading ? 'Adicionando...' : 'Adicionar'}
                </Button>
              </Box>
            </CardContent>
          </Card>
          <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#008000', fontWeight: 'bold', mb: 2 }}>
                Distribuição de Pets por Tipo
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PieChart width={isMobile ? 250 : 350} height={isMobile ? 200 : 250}>
                  <Pie
                    data={typeCounts}
                    cx={isMobile ? 125 : 175}
                    cy={isMobile ? 100 : 125}
                    innerRadius={isMobile ? 40 : 60}
                    outerRadius={isMobile ? 80 : 100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {typeCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Box>
            </CardContent>
          </Card>
        </Box>
        {/* Tabela de pets */}
        <Box sx={{ flex: 2, minWidth: 320 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: '#fff', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#A52A2A', fontWeight: 'bold', mb: 2 }}>
                Lista de Pets
              </Typography>
              <Box sx={{ height: 350 }}>
                <DataGrid
                  rows={pets}
                  columns={columns}
                  pageSizeOptions={[5]}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  sx={{
                    '& .MuiDataGrid-columnHeaders': {
                      backgroundColor: '#FFA500',
                      color: '#FFF',
                      fontWeight: 'bold',
                    },
                    '& .MuiDataGrid-cell': {
                      color: '#000',
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default PetPage;
