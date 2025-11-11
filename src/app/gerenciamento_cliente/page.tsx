// Página de Gerenciamento de Clientes
// Requisitos: CRUD completo, MUI, SWR, mock, modais, boas práticas, tudo em um arquivo
"use client";
import React, { useState, useMemo } from "react";
import useSWR from "swr";
import PetsIcon from '@mui/icons-material/Pets';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	TextField,
	Typography,
	CircularProgress,
	Snackbar,
	Alert,
	Tooltip,
	useMediaQuery,
	Avatar,
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import PawIcon from '../../components/PawIcon';
import BoneIcon from '../../components/BoneIcon';
import CatIcon from '../../components/CatIcon';
import DogIcon from '../../components/DogIcon';
import SearchIcon from '../../components/SearchIcon';
import "./petfarma.style.css";
import { useTheme } from "@mui/material/styles";

// Tipos e interfaces
interface Cliente {
	id: number;
	nome: string;
	email: string;
	telefone: string;
}

// Mock de dados (simula uma API)
const mockClientes: Cliente[] = [
	{ id: 1, nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-1111" },
	{ id: 2, nome: "Maria Souza", email: "maria@email.com", telefone: "(21) 98888-2222" },
	{ id: 3, nome: "Carlos Lima", email: "carlos@email.com", telefone: "(31) 97777-3333" },
];

// Função mock para simular fetch de clientes
const fetchClientes = async (): Promise<Cliente[]> => {
	// Simula delay de rede
	await new Promise((res) => setTimeout(res, 600));
	// Retorna uma cópia dos dados
	return JSON.parse(JSON.stringify(mockClientes));
};

// Hook customizado para clientes usando SWR
function useClientes() {
	// Chave 'clientes' para cache SWR
	const { data, error, isLoading, mutate } = useSWR("clientes", fetchClientes, {
		revalidateOnFocus: false,
	});

	// CRUD local (mock):
	const addCliente = async (novo: Omit<Cliente, "id">) => {
		const id = Math.floor(Math.random() * 100000) + 10;
		const novoCliente = { ...novo, id };
		mutate([...(data || []), novoCliente], false);
		return novoCliente;
	};

	const updateCliente = async (id: number, atual: Omit<Cliente, "id">) => {
		mutate(
			(clientes?: Cliente[]) =>
				clientes?.map((c) => (c.id === id ? { ...c, ...atual } : c)) || [],
			false
		);
	};

	const deleteCliente = async (id: number) => {
		mutate((clientes?: Cliente[]) => clientes?.filter((c) => c.id !== id) || [], false);
	};

	return { data, error, isLoading, addCliente, updateCliente, deleteCliente, mutate };
}

// Componente principal
export default function GerenciamentoClientePage() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const { data: clientes, error, isLoading, addCliente, updateCliente, deleteCliente } = useClientes();
	const [openForm, setOpenForm] = useState(false);
	const [editando, setEditando] = useState<Cliente | null>(null);
	const [openDelete, setOpenDelete] = useState<null | Cliente>(null);
	const [openView, setOpenView] = useState<null | Cliente>(null);
	const [snackbar, setSnackbar] = useState<{ open: boolean; msg: string; type: "success" | "error" }>({ open: false, msg: "", type: "success" });
	const [form, setForm] = useState<Omit<Cliente, "id">>({ nome: "", email: "", telefone: "" });
	const [formError, setFormError] = useState<{ nome?: string; email?: string; telefone?: string }>({});
	const [formLoading, setFormLoading] = useState(false);
	const [busca, setBusca] = useState("");

	// Filtro de clientes por busca
	const clientesFiltrados = useMemo(() => {
		if (!busca.trim()) return clientes;
		const termo = busca.toLowerCase();
		return clientes?.filter(
			c => c.nome.toLowerCase().includes(termo) || c.telefone.replace(/\D/g, "").includes(termo.replace(/\D/g, ""))
		);
	}, [clientes, busca]);

	// Validação básica
	function validarForm(): boolean {
		const err: typeof formError = {};
		if (!form.nome.trim()) err.nome = "Nome obrigatório";
		if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) err.email = "Email válido obrigatório";
		if (!form.telefone.trim() || !/^\(?\d{2}\)? ?9?\d{4}-?\d{4}$/.test(form.telefone)) err.telefone = "Telefone válido obrigatório";
		setFormError(err);
		return Object.keys(err).length === 0;
	}

	// Abrir modal de novo cliente
	function handleNovoCliente() {
		setEditando(null);
		setForm({ nome: "", email: "", telefone: "" });
		setFormError({});
		setOpenForm(true);
	}

	// Abrir modal de edição
	function handleEditar(cliente: Cliente) {
		setEditando(cliente);
		setForm({ nome: cliente.nome, email: cliente.email, telefone: cliente.telefone });
		setFormError({});
		setOpenForm(true);
	}

	// Salvar (criar ou editar)
	async function handleSalvar() {
		if (!validarForm()) return;
		setFormLoading(true);
		try {
			if (editando) {
				await updateCliente(editando.id, form);
				setSnackbar({ open: true, msg: "Cliente atualizado!", type: "success" });
			} else {
				await addCliente(form);
				setSnackbar({ open: true, msg: "Cliente adicionado!", type: "success" });
			}
			setOpenForm(false);
		} catch {
			setSnackbar({ open: true, msg: "Erro ao salvar cliente", type: "error" });
		} finally {
			setFormLoading(false);
		}
	}

	// Confirmar exclusão
	async function handleConfirmarDelete() {
		if (!openDelete) return;
		try {
			await deleteCliente(openDelete.id);
			setSnackbar({ open: true, msg: "Cliente deletado!", type: "success" });
		} catch {
			setSnackbar({ open: true, msg: "Erro ao deletar cliente", type: "error" });
		} finally {
			setOpenDelete(null);
		}
	}

	// Renderização
	return (
		<div className="petfarma-bg">
			{/* Header fixo */}
			<header className="petfarma-header">
				<span className="petfarma-logo">
					<Avatar sx={{ bgcolor: '#FFA500', mr: 2 }}>
						<PetsIcon sx={{ color: '#05344a' }} />
					</Avatar>
					Pet Farma <span style={{ fontWeight: 400, fontSize: 18, marginLeft: 6 }}>- Gerenciamento de Clientes</span>
				</span>
				<div className="petfarma-search">
					<input
						type="text"
						placeholder="Buscar clientes por nome ou telefone..."
						value={busca}
						onChange={e => setBusca(e.target.value)}
					/>
					<span className="search-icon"><SearchIcon size={22} color="#002B3A" /></span>
				</div>
			</header>

			{/* Ícones decorativos pets */}
			<PawIcon size={60} color="#A8E6CF" className="petfarma-pet-icon" style={{ left: 10, top: 120 }} /> 
			<BoneIcon size={60} color="#DFF6FF" className="petfarma-pet-icon" style={{ right: 10, top: 180 }} />
			<CatIcon size={54} color="#DFF6FF" className="petfarma-pet-icon" style={{ left: 30, bottom: 60 }} />
			<DogIcon size={54} color="#A8E6CF" className="petfarma-pet-icon" style={{ right: 30, bottom: 40 }} />

			{/* Tabela de clientes */}
			<div className="petfarma-table-container">
				<table className="petfarma-table">
					<thead>
						<tr>
							<th>Nome</th>
							<th>Email</th>
							<th>Telefone</th>
							<th style={{ textAlign: 'center' }}>Ações</th>
						</tr>
					</thead>
					<tbody>
						{isLoading ? (
							<tr>
								<td colSpan={4} style={{ textAlign: 'center', padding: 40 }}>
									<CircularProgress />
								</td>
							</tr>
						) : error ? (
							<tr>
								<td colSpan={4} style={{ textAlign: 'center', color: '#e57373', fontWeight: 600 }}>
									Erro ao carregar clientes.
								</td>
							</tr>
						) : clientesFiltrados && clientesFiltrados.length > 0 ? (
							clientesFiltrados.map((cliente) => (
								<tr key={cliente.id}>
									<td>{cliente.nome}</td>
									<td>{cliente.email}</td>
									<td>{cliente.telefone}</td>
									<td>
										<div className="petfarma-actions">
											<Tooltip title="Visualizar">
												<IconButton className="petfarma-action-btn" onClick={() => setOpenView(cliente)}>
													<Visibility style={{ color: '#007BFF' }} />
												</IconButton>
											</Tooltip>
											<Tooltip title="Editar">
												<IconButton className="petfarma-action-btn" onClick={() => handleEditar(cliente)}>
													<Edit style={{ color: '#A8E6CF' }} />
												</IconButton>
											</Tooltip>
											<Tooltip title="Deletar">
												<IconButton className="petfarma-action-btn" onClick={() => setOpenDelete(cliente)}>
													<Delete style={{ color: '#e57373' }} />
												</IconButton>
											</Tooltip>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={4} style={{ textAlign: 'center', color: '#002B3A', fontWeight: 600, fontSize: 18 }}>
									Nenhum cliente cadastrado.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Modal de criar/editar cliente */}
			<Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="xs">
				<DialogTitle sx={{ fontFamily: 'Nunito, Arial, sans-serif', fontWeight: 700 }}>
					{editando ? "Editar Cliente" : "Novo Cliente"}
				</DialogTitle>
				<DialogContent>
					<Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
						<TextField
							label="Nome"
							value={form.nome}
							onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
							error={!!formError.nome}
							helperText={formError.nome}
							autoFocus
							required
							inputProps={{ style: { fontFamily: 'Nunito, Arial, sans-serif' } }}
						/>
						<TextField
							label="Email"
							value={form.email}
							onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
							error={!!formError.email}
							helperText={formError.email}
							required
							type="email"
							inputProps={{ style: { fontFamily: 'Nunito, Arial, sans-serif' } }}
						/>
						<TextField
							label="Telefone"
							value={form.telefone}
							onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}
							error={!!formError.telefone}
							helperText={formError.telefone}
							required
							placeholder="(11) 99999-9999"
							inputProps={{ style: { fontFamily: 'Nunito, Arial, sans-serif' } }}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenForm(false)} disabled={formLoading}>Cancelar</Button>
					<Button onClick={handleSalvar} variant="contained" color="primary" disabled={formLoading}>
						{formLoading ? <CircularProgress size={22} /> : editando ? "Salvar" : "Adicionar"}
					</Button>
				</DialogActions>
			</Dialog>

			{/* Modal de visualizar cliente */}
			<Dialog open={!!openView} onClose={() => setOpenView(null)} fullWidth maxWidth="xs">
				<DialogTitle sx={{ fontFamily: 'Nunito, Arial, sans-serif', fontWeight: 700 }}>Detalhes do Cliente</DialogTitle>
				<DialogContent>
					{openView && (
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
							<Typography><b>Nome:</b> {openView.nome}</Typography>
							<Typography><b>Email:</b> {openView.email}</Typography>
							<Typography><b>Telefone:</b> {openView.telefone}</Typography>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenView(null)}>Fechar</Button>
				</DialogActions>
			</Dialog>

			{/* Modal de confirmação de exclusão */}
			<Dialog open={!!openDelete} onClose={() => setOpenDelete(null)} fullWidth maxWidth="xs">
				<DialogTitle sx={{ fontFamily: 'Nunito, Arial, sans-serif', fontWeight: 700 }}>Confirmar Exclusão</DialogTitle>
				<DialogContent>
					<Typography>Tem certeza que deseja deletar o cliente <b>{openDelete?.nome}</b>?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDelete(null)}>Cancelar</Button>
					<Button onClick={handleConfirmarDelete} color="error" variant="contained">Deletar</Button>
				</DialogActions>
			</Dialog>

			{/* Snackbar de feedback */}
			<Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
				<Alert severity={snackbar.type} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} sx={{ width: "100%" }}>
					{snackbar.msg}
				</Alert>
			</Snackbar>
		</div>
	);
}
