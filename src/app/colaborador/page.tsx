'use client';

import React, { useState, useMemo, useEffect } from 'react';
import api from '../../service/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, TextField, Typography, AppBar, Toolbar, Avatar, Paper, Card, CardContent } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#FFA500', '#008000', '#000000', '#A52A2A', '#FFFFFF']; // laranja, verde, preto, marrom, branco

// Removido mock, será populado via API

const CollaboratorsPage = () => {
  const [collaborators, setCollaborators] = useState([]);
  const [deleteError, setDeleteError] = useState('');
  // Função para deletar colaborador
  const handleDeleteCollaborator = async (id) => {
    setDeleteError('');
    try {
      await api.delete(`/colaboradores/deletar_colaborador/${id}`);
      setCollaborators(collaborators.filter((colab) => colab.id !== id));
    } catch (err) {
      setDeleteError('Erro ao deletar colaborador.');
    }
  };
  // Buscar colaboradores existentes na montagem
  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const response = await api.get('/colaboradores/');
        // Adapta o retorno para o formato do DataGrid
        if (response.data && Array.isArray(response.data.data)) {
          const mapped = response.data.data.map((colab) => ({
            id: colab.ID || colab.id,
            name: colab.NOME || colab.nome,
            role: colab.CARGO || colab.cargo || '',
            cpf: colab.CPF || colab.cpf || '',
            telefone: colab.TELEFONE || colab.telefone || '',
          }));
          setCollaborators(mapped);
        }
      } catch (err) {
        // Pode adicionar tratamento de erro se desejar
      }
    };
    fetchCollaborators();
  }, []);
  const [newCollaborator, setNewCollaborator] = useState({ name: '', role: '', cpf: '', telefone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddCollaborator = async () => {
    if (
      newCollaborator.name.trim() === '' ||
      newCollaborator.role.trim() === '' ||
      newCollaborator.cpf.trim() === '' ||
      newCollaborator.telefone.trim() === ''
    ) {
      setError('Preencha todos os campos.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/colaboradores/Cadastrar_Colaborador', {
        nome: newCollaborator.name,
        cargo: newCollaborator.role,
        cpf: newCollaborator.cpf,
        telefone: newCollaborator.telefone,
      });
      setCollaborators([
        ...collaborators,
        { ...newCollaborator, id: collaborators.length + 1 },
      ]);
      setNewCollaborator({ name: '', role: '', cpf: '', telefone: '' });
    } catch (err) {
      setError('Erro ao cadastrar colaborador.');
    }
    setLoading(false);
  };

  // Colunas para DataGrid
  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Nome',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#FFA500' }}>
          <PersonIcon />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Cargo',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#008000' }}>
          <WorkIcon />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'cpf',
      headerName: 'CPF',
      flex: 1,
    },
    {
      field: 'telefone',
      headerName: 'Telefone',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 0.7,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDeleteCollaborator(params.row.id)}
        >
          Excluir
        </Button>
      ),
    },
  ];

  // Dados para gráfico - contagem por cargo
  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    collaborators.forEach(({ role }) => {
      counts[role] = (counts[role] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [collaborators]);

  return (
    <Box sx={{ bgcolor: '#f6f8fa', minHeight: '100vh', fontFamily: 'Poppins, Roboto, sans-serif' }}>
      {/* Cabeçalho fixo */}
      <AppBar position="static" elevation={2} sx={{ bgcolor: '#05344a', mb: 5 }}>
        <Toolbar>
          <Avatar sx={{ bgcolor: '#FFA500', mr: 2 }}>
            <GroupIcon sx={{ color: '#05344a' }} />
          </Avatar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
            Gerenciar Colaboradores
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 } }}>
        {/* Área de cadastro */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3, bgcolor: '#fff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#A52A2A', fontWeight: 'bold', mb: 2 }}>
              Adicionar Novo Colaborador
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                label="Nome"
                variant="outlined"
                size="small"
                value={newCollaborator.name}
                onChange={(e) => setNewCollaborator({ ...newCollaborator, name: e.target.value })}
                sx={{ bgcolor: '#FFF', minWidth: 180 }}
              />
              <TextField
                label="Cargo"
                variant="outlined"
                size="small"
                value={newCollaborator.role}
                onChange={(e) => setNewCollaborator({ ...newCollaborator, role: e.target.value })}
                sx={{ bgcolor: '#FFF', minWidth: 180 }}
              />
              <TextField
                label="CPF"
                variant="outlined"
                size="small"
                value={newCollaborator.cpf}
                onChange={(e) => setNewCollaborator({ ...newCollaborator, cpf: e.target.value })}
                sx={{ bgcolor: '#FFF', minWidth: 140 }}
              />
              <TextField
                label="Telefone"
                variant="outlined"
                size="small"
                value={newCollaborator.telefone}
                onChange={(e) => setNewCollaborator({ ...newCollaborator, telefone: e.target.value })}
                sx={{ bgcolor: '#FFF', minWidth: 140 }}
              />
              <Button variant="contained" onClick={handleAddCollaborator} disabled={loading} sx={{ bgcolor: '#FFA500', color: '#fff', fontWeight: 'bold', borderRadius: 2, px: 3, py: 1, fontSize: '1rem', boxShadow: 2 }}>
                {loading ? 'Adicionando...' : 'Adicionar'}
              </Button>
            </Box>
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* DataGrid moderno */}
        <Paper elevation={4} sx={{ height: 340, mb: 5, borderRadius: 3, overflow: 'hidden', bgcolor: '#fff' }}>
          <DataGrid
            rows={collaborators}
            columns={columns}
            pageSizeOptions={[5]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#FFA500',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              },
              '& .MuiDataGrid-cell': {
                color: '#000',
                fontSize: '1rem',
              },
              '& .MuiDataGrid-row': {
                transition: 'background 0.2s',
                '&:hover': { background: '#fffbe6' },
              },
            }}
          />
          {deleteError && (
            <Typography color="error" sx={{ mt: 2, ml: 2 }}>
              {deleteError}
            </Typography>
          )}
        </Paper>

        {/* Gráfico em card */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: '#fff', p: 2 }}>
          <Typography variant="h6" mb={2} color="#008000" sx={{ fontWeight: 'bold' }}>
            Distribuição de Colaboradores por Cargo
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart width={400} height={300}>
              <Pie
                data={roleCounts}
                cx={200}
                cy={150}
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {roleCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default CollaboratorsPage;
