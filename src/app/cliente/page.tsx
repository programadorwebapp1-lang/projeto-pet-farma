'use client';

import api from '../../service/api';
import { AppBar, Toolbar, Typography, Avatar, Card, CardContent, Box, Button, TextField, Chip } from '@mui/material';
import React, { useState } from 'react';
import PetsIcon from '@mui/icons-material/Pets';
interface Product {
  id: number;
  name: string;
  quantity: number;
}

interface Client {
  id: number;
  name: string;
  phone: string;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  deliveryType: 'entrega' | 'retirada';
  products: Product[];
}

const ClientPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
    deliveryType: 'entrega' as 'entrega' | 'retirada',
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: 1 });

  const handleAddClient = async () => {
    // Validação: não precisa validar complemento pois é opcional
    if (
      !newClient.name ||
      !newClient.email ||
      !newClient.password ||
      !newClient.phone ||
      !newClient.street ||
      !newClient.number ||
      !newClient.neighborhood
    ) {
      alert('Por favor, preencha todos os dados obrigatórios do cliente.');
      return;
    }

    try {
      await api.post('/auth/criar_conta', {
        nome: newClient.name,
        email: newClient.email,
        senha: newClient.password,
        rua: newClient.street,
        numero: newClient.number,
        bairro: newClient.neighborhood,
        complemento: newClient.complement,
        telefone: newClient.phone,
        ativo: true,
        admin: false,
      });
      // Adiciona o cliente localmente (mock)
      const client: Client = {
        id: clients.length + 1,
        name: newClient.name,
        phone: newClient.phone,
        street: newClient.street,
        number: newClient.number,
        neighborhood: newClient.neighborhood,
        complement: newClient.complement,
        deliveryType: newClient.deliveryType,
        products,
      };
      setClients([...clients, client]);
      setNewClient({
        name: '',
        email: '',
        password: '',
        phone: '',
        street: '',
        number: '',
        neighborhood: '',
        complement: '',
        deliveryType: 'entrega',
      });
      setProducts([]);
      alert('Cliente cadastrado com sucesso!');
    } catch (error) {
      alert('Erro ao cadastrar cliente.');
    }
  };

  const handleAddProduct = () => {
    if (!newProduct.name.trim() || newProduct.quantity < 1) {
      alert('Informe um nome e quantidade válida para o produto.');
      return;
    }
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setNewProduct({ name: '', quantity: 1 });
  };

  const handleRemoveProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <Box sx={{ bgcolor: '#f6f8fa', minHeight: '100vh', fontFamily: 'Poppins, Roboto, sans-serif' }}>
      {/* Cabeçalho fixo */}
      <AppBar position="static" elevation={2} sx={{ bgcolor: '#05344a', mb: 5 }}>
        <Toolbar>
          <Avatar sx={{ bgcolor: '#FFA500', mr: 2 }}>
            <PetsIcon sx={{ color: '#05344a' }} />
          </Avatar>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
            Gerenciar Clientes e Pedidos PetFarma
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 700, mx: 'auto', p: { xs: 2, md: 4 } }}>
        {/* Formulário Cliente */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3, bgcolor: '#fff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#008000', fontWeight: 'bold', mb: 2 }}>
              Cadastrar Cliente
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Nome"
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                variant="outlined"
                size="small"
                sx={{ bgcolor: '#fff' }}
              />
              <TextField
                label="E-mail"
                value={newClient.email}
                onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                variant="outlined"
                size="small"
                sx={{ bgcolor: '#fff' }}
                type="email"
              />
              <TextField
                label="Senha"
                value={newClient.password}
                onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                variant="outlined"
                size="small"
                sx={{ bgcolor: '#fff' }}
                type="password"
              />
              <TextField
                label="Telefone"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                variant="outlined"
                size="small"
                sx={{ bgcolor: '#fff' }}
              />
              <Typography sx={{ color: '#555', fontSize: 14, mt: 0, mb: 0 }}>
                Por favor, informe o endereço completo para que possamos realizar a entrega corretamente.
              </Typography>
              <TextField
                label="Rua"
                value={newClient.street}
                onChange={(e) => setNewClient({ ...newClient, street: e.target.value })}
                variant="outlined"
                size="small"
                sx={{ bgcolor: '#fff' }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Número"
                  value={newClient.number}
                  onChange={(e) => setNewClient({ ...newClient, number: e.target.value })}
                  variant="outlined"
                  size="small"
                  sx={{ bgcolor: '#fff', width: '40%' }}
                />
                <TextField
                  label="Bairro"
                  value={newClient.neighborhood}
                  onChange={(e) => setNewClient({ ...newClient, neighborhood: e.target.value })}
                  variant="outlined"
                  size="small"
                  sx={{ bgcolor: '#fff', width: '60%' }}
                />
              </Box>
              <TextField
                label="Complemento (opcional)"
                value={newClient.complement}
                onChange={(e) => setNewClient({ ...newClient, complement: e.target.value })}
                variant="outlined"
                size="small"
                sx={{ bgcolor: '#fff' }}
              />
              <Box sx={{ mt: 1 }}>
                <Typography fontWeight="bold" fontSize={15} mb={1}>Tipo de entrega:</Typography>
                <Chip
                  label="Entregar no endereço"
                  color={newClient.deliveryType === 'entrega' ? 'success' : 'default'}
                  onClick={() => setNewClient({ ...newClient, deliveryType: 'entrega' })}
                  sx={{ mr: 2, cursor: 'pointer', fontWeight: 'bold' }}
                />
                <Chip
                  label="Retirar na loja"
                  color={newClient.deliveryType === 'retirada' ? 'primary' : 'default'}
                  onClick={() => setNewClient({ ...newClient, deliveryType: 'retirada' })}
                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                />
              </Box>
              <Typography variant="subtitle1" sx={{ color: '#A0522D', mt: 2, mb: 1, fontWeight: 'bold' }}>
                Adicionar Produtos
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <TextField
                  label="Nome do Produto"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  variant="outlined"
                  size="small"
                  sx={{ flexGrow: 1, bgcolor: '#fff' }}
                />
                <TextField
                  label="Qtd"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 1 })}
                  variant="outlined"
                  size="small"
                  sx={{ width: 80, bgcolor: '#fff' }}
                />
                <Button onClick={handleAddProduct} sx={{ bgcolor: '#FFA500', color: '#000', fontWeight: 'bold', borderRadius: 2, px: 2, minWidth: 40, fontSize: 22, boxShadow: 1 }}>
                  +
                </Button>
              </Box>
              {products.length > 0 && (
                <Box sx={{ mt: 1, p: 1, bgcolor: '#f9f9f9', borderRadius: 2, maxHeight: 150, overflowY: 'auto' }}>
                  <Typography fontWeight="bold" fontSize={15} mb={1}>Produtos adicionados:</Typography>
                  <ul className="cliente-produtos-lista">
                    {products.map((product) => (
                      <li key={product.id} className="cliente-produto-item">
                        <span>{product.name} - Qtd: {product.quantity}</span>
                        <Button onClick={() => handleRemoveProduct(product.id)} sx={{ bgcolor: '#A52A2A', color: '#fff', minWidth: 32, borderRadius: 2, fontWeight: 'bold', fontSize: 16, p: 0, height: 32 }}>
                          x
                        </Button>
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
              <Button onClick={handleAddClient} sx={{ bgcolor: '#008000', color: '#fff', fontWeight: 'bold', borderRadius: 2, mt: 2, fontSize: 16, py: 1.5, boxShadow: 2 }} fullWidth>
                Cadastrar Cliente com Pedido
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Clientes cadastrados */}
        <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: '#fff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: '#A0522D', fontWeight: 'bold', mb: 2 }}>
              Pedidos Realizados
            </Typography>
            {clients.length === 0 && <Typography>Nenhum pedido cadastrado.</Typography>}
            <Box component="ul" sx={{ pl: 0, listStyle: 'none', m: 0 }}>
              {clients.map((client) => (
                <Box
                  key={client.id}
                  component="li"
                  sx={{
                    bgcolor: '#fff8e1',
                    mb: 2,
                    p: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <Typography fontWeight="bold" fontSize={17} color="#A0522D">
                    {client.name}
                  </Typography>
                  <Typography fontSize={15}>Telefone: {client.phone}</Typography>
                  <Typography fontSize={15}>
                    Endereço: {client.street}, {client.number} - {client.neighborhood}
                    {client.complement && `, Complemento: ${client.complement}`}
                  </Typography>
                  <Typography fontSize={15}>
                    Tipo: <strong>{client.deliveryType === 'entrega' ? 'Entrega' : 'Retirada na loja'}</strong>
                  </Typography>
                  <Typography fontWeight="bold" fontSize={15} mt={1}>Produtos:</Typography>
                  <ul className="cliente-pedido-lista">
                    {client.products.map((p) => (
                      <li key={p.id} className="cliente-pedido-item">
                        - {p.name} (Qtd: {p.quantity})
                      </li>
                    ))}
                  </ul>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

// Estilos reutilizáveis
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: 10,
  marginBottom: 10,
  borderRadius: 4,
  border: '1px solid #ccc',
};

const buttonStyle = (
  backgroundColor: string,
  color: string,
  width = 'auto',
  fontSize = 12
): React.CSSProperties => ({
  backgroundColor,
  color,
  border: 'none',
  borderRadius: 4,
  padding: '10px 15px',
  cursor: 'pointer',
  fontWeight: 'bold',
  width,
  fontSize,
});

export default ClientPage;
