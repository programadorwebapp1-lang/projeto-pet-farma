'use client';

import React, { useState } from 'react';
import api from '../../service/api';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Button, TextField, Typography, Card, CardContent, AppBar, Toolbar, Avatar, useMediaQuery, InputAdornment, Popper, Paper, List, ListItem, ListItemAvatar, ListItemText, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PetsIcon from '@mui/icons-material/Pets';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';

const COLORS = ['#FFA500', '#008000', '#000000', '#A52A2A', '#FFFFFF'];

const mockProducts = [
  { id: 1, name: 'Vermífugo Canino', category: 'Vermífugo', price: 59.90, stock: 20 },
  { id: 2, name: 'Vacina Antirrábica', category: 'Vacina', price: 120.00, stock: 15 },
];


const ProdutoPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
  });

  // Buscar produtos da API ao montar
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/remedios/');
        // Mapeia os dados da API para o formato usado na tabela
        const apiProducts = response.data.data.map((item) => ({
          id: item.ID,
          name: item.NOME,
          category: item.DESCRICAO,
          price: item.PRECO,
          stock: item.ESTOQUE,
        }));
        setProducts(apiProducts);
      } catch (error) {
        // Se falhar, não mostra nada (não usa mockProducts)
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  // Filtra os produtos conforme a pesquisa
  const filteredProducts = products.filter((product) => {
    const searchLower = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  });

  const handleAddProduct = async () => {
    if (
      !newProduct.name.trim() ||
      !newProduct.category.trim() ||
      !newProduct.price.trim() ||
      !newProduct.stock.trim()
    ) return;

    const priceNum = parseFloat(newProduct.price);
    const stockNum = parseInt(newProduct.stock);

    if (isNaN(priceNum) || isNaN(stockNum)) return;

    // Envia para a API
    try {
      const payload = {
        nome: newProduct.name,
        descricao: newProduct.category,
        preco: priceNum,
        estoque: stockNum,
        receita: "True"
      };
      await api.post('/remedios/Cadastrar_remedio', payload);
      // Adiciona localmente para feedback imediato
      setProducts([
        ...products,
        {
          id: products.length + 1,
          name: newProduct.name,
          category: newProduct.category,
          price: priceNum,
          stock: stockNum,
        },
      ]);
      setNewProduct({ name: '', category: '', price: '', stock: '' });
    } catch (error) {
      alert('Erro ao cadastrar remédio!');
    }
  };

  // Função para deletar remédio
  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/remedios/deletar_remedio/${id}`);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      alert('Erro ao deletar remédio!');
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
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
      field: 'category',
      headerName: 'Categoria',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#008000' }}>
          <CategoryIcon />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'price',
      headerName: 'Preço (R$)',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#000000' }}>
          <AttachMoneyIcon />
          {params.value.toFixed(2)}
        </Box>
      ),
    },
    {
      field: 'stock',
      headerName: 'Estoque',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#A52A2A' }}>
          <InventoryIcon />
          {params.value}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDeleteProduct(params.row.id)}>
          <CloseIcon />
        </IconButton>
      ),
    },
  ];

  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <Box sx={{ bgcolor: '#f6f8fa', minHeight: '100vh', fontFamily: 'Poppins, Roboto, sans-serif' }}>
      {/* AppBar fixo */}
      <AppBar position="static" elevation={2} sx={{ bgcolor: '#05344a', mb: 5 }}>
        <Toolbar>
          <Avatar sx={{ bgcolor: '#FFA500', mr: 2 }}>
            <InventoryIcon sx={{ color: '#05344a' }} />
          </Avatar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
            Gerenciar Produtos PetFarma
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 900, mx: 'auto', p: { xs: 2, md: 4 }, display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 4 }}>
        {/* Formulário de cadastro */}
        <Box sx={{ flex: 1, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: '#fff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#008000', fontWeight: 'bold', mb: 2 }}>
                Cadastrar Produto
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Nome"
                  variant="outlined"
                  size="small"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  sx={{ bgcolor: '#FFF' }}
                />
                <TextField
                  label="Categoria"
                  variant="outlined"
                  size="small"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  sx={{ bgcolor: '#FFF' }}
                />
                <TextField
                  label="Preço"
                  variant="outlined"
                  size="small"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  sx={{ bgcolor: '#FFF' }}
                  type="number"
                  inputProps={{ step: '0.01' }}
                />
                <TextField
                  label="Estoque"
                  variant="outlined"
                  size="small"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  sx={{ bgcolor: '#FFF' }}
                  type="number"
                />
                <Button variant="contained" onClick={handleAddProduct} sx={{ bgcolor: '#FFA500', color: '#000', fontWeight: 'bold', borderRadius: 2, mt: 1, fontSize: 16, py: 1.2, boxShadow: 2 }}>
                  Adicionar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
        {/* Tabela de produtos */}
        <Box sx={{ flex: 2, minWidth: 320 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: '#fff', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#A52A2A', fontWeight: 'bold', mb: 2 }}>
                Lista de Produtos
              </Typography>
              {/* Campo de pesquisa com autocomplete */}
              <Box sx={{ position: 'relative', mb: 2 }}>
                <TextField
                  label="Pesquisar por nome ou categoria"
                  variant="outlined"
                  size="small"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setAnchorEl(e.currentTarget);
                  }}
                  onFocus={(e) => setAnchorEl(e.currentTarget)}
                  onBlur={() => setTimeout(() => setAnchorEl(null), 150)}
                  sx={{ bgcolor: '#f6f8fa' }}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {search ? (
                          <IconButton onClick={() => setSearch('')} size="small">
                            <CloseIcon />
                          </IconButton>
                        ) : (
                          <SearchIcon />
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
                <Popper open={!!search && filteredProducts.length > 0 && !!anchorEl} anchorEl={anchorEl} placement="bottom-start" style={{ zIndex: 1300, width: anchorEl?.offsetWidth }}>
                  <Paper elevation={3} sx={{ mt: 1, width: anchorEl?.offsetWidth || 350 }}>
                    <List>
                      {filteredProducts.slice(0, 6).map((item) => (
                        <ListItem key={item.id} alignItems="flex-start" sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#f6f8fa' } }}>
                          <ListItemAvatar>
                            {/* Se houver imagem, exibe, senão mostra Avatar padrão */}
                            {item.img ? (
                              <Avatar src={item.img} alt={item.name} />
                            ) : (
                              <Avatar sx={{ bgcolor: '#FFA500', color: '#05344a' }}>
                                <InventoryIcon fontSize="small" />
                              </Avatar>
                            )}
                          </ListItemAvatar>
                          <ListItemText
                            primary={<span style={{ fontWeight: 600 }}>{item.name}</span>}
                            secondary={<span style={{ color: '#A52A2A', fontWeight: 500 }}>{item.category}</span>}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Popper>
              </Box>
              <Box sx={{ height: 350 }}>
                <DataGrid
                  rows={filteredProducts}
                  columns={columns}
                  pageSizeOptions={[5]}
                  initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
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

export default ProdutoPage;
