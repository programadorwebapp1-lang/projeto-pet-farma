"use client";

import React, { useState } from "react";
import api from "../../service/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
	Box,
	Button,
	TextField,
	Typography,
	Card,
	CardContent,
	AppBar,
	Toolbar,
	Avatar,
	useMediaQuery,
	InputAdornment,
	Popper,
	Paper,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import ToysIcon from "@mui/icons-material/Toys";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import Autocomplete from "@mui/material/Autocomplete";

const COLORS = ["#FFA500", "#008000", "#000000", "#A52A2A", "#FFFFFF"];

const mockProducts = [
	{ id: 1, name: "Bola Colorida", category: "Bolas", price: 29.9, stock: 10 },
	{ id: 2, name: "Mordedor de Borracha", category: "Mordedores", price: 19.9, stock: 25 },
];

const ProdutoBrinquedoPage = () => {
	const [products, setProducts] = useState([]);
	const [search, setSearch] = useState("");
	const [anchorEl, setAnchorEl] = useState(null);
	const [newProduct, setNewProduct] = useState({
		name: "",
		category: "",
		price: "",
		stock: "",
		image: "",
		description: "",
		newCategory: "",
	});

	React.useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await api.get("/brinquedos/");
				const apiProducts = response.data.data.map((item) => ({
					id: item.ID,
					name: item.NOME,
					category: item.DESCRICAO,
					price: item.PRECO,
					stock: item.ESTOQUE,
					image: item.IMAGEM,
					description: item.DESCRICAO_COMPLETA,
				}));
				setProducts(apiProducts);
			} catch (error) {
				console.error("Erro ao buscar produtos:", error);
			}
		};

		fetchProducts();
	}, []);

	const filteredProducts = products.filter(
		(product) =>
			product.name.toLowerCase().includes(search.toLowerCase()) ||
			product.category.toLowerCase().includes(search.toLowerCase())
	);

	const handleAddProduct = async () => {
		const errors = [];
		let categoriaFinal = newProduct.category;
		if (newProduct.category === "Outra") {
			if (!newProduct.newCategory || !newProduct.newCategory.trim()) {
				errors.push("Informe a nova categoria.");
			} else {
				categoriaFinal = newProduct.newCategory.trim();
			}
		} else if (!newProduct.category.trim()) {
			errors.push("Categoria é obrigatória.");
		}
		if (!newProduct.description.trim()) errors.push("Descrição é obrigatória.");
		if (!newProduct.price.trim()) errors.push("Preço é obrigatório.");
		if (!newProduct.stock.trim()) errors.push("Estoque é obrigatório.");

		const priceNum = parseFloat(newProduct.price);
		const stockNum = parseInt(newProduct.stock);
		if (isNaN(priceNum)) errors.push("Preço deve ser um número.");
		if (isNaN(stockNum)) errors.push("Estoque deve ser um número inteiro.");

		if (errors.length > 0) {
			alert("Preencha corretamente:\n" + errors.join("\n"));
			return;
		}

		try {
			const payload = {
				nome: newProduct.name,
				categoria: categoriaFinal,
				descricao: newProduct.description,
				preco: priceNum,
				estoque: stockNum,
			};
			console.log("Payload enviado:", payload);
			await api.post("/brinquedos/cadastrar", payload);
			setProducts([
				...products,
				{
					id: products.length + 1,
					name: newProduct.name,
					category: categoriaFinal,
					price: priceNum,
					stock: stockNum,
					img: newProduct.image,
					description: newProduct.description,
				},
			]);
			setNewProduct({ name: "", category: "", price: "", stock: "", image: "", description: "", newCategory: "" });
		} catch (error) {
			if (error.response && error.response.data) {
				console.error("Erro detalhado da API:", error.response.data);
				alert("Erro ao cadastrar brinquedo:\n" + JSON.stringify(error.response.data));
			} else {
				alert("Erro ao cadastrar brinquedo!\n" + error.message);
			}
		}
	};

	const handleDeleteProduct = async (id) => {
		try {
			await api.delete(`/brinquedos/deletar/${id}`);
			setProducts(products.filter((product) => product.id !== id));
		} catch (error) {
			alert("Erro ao deletar brinquedo!");
		}
	};

	const columns: GridColDef[] = [
		{
			field: "name",
			headerName: "Nome",
			flex: 1,
			renderCell: (params) => (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#FFA500" }}>
					<ToysIcon />
					{params.value}
				</Box>
			),
		},
		{
			field: "category",
			headerName: "Categoria",
			flex: 1,
			renderCell: (params) => (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#008000" }}>
					<CategoryIcon />
					{params.value}
				</Box>
			),
		},
		{
			field: "price",
			headerName: "Preço (R$)",
			flex: 1,
			renderCell: (params) => (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#000000" }}>
					<AttachMoneyIcon />
					{params.value.toFixed(2)}
				</Box>
			),
		},
		{
			field: "stock",
			headerName: "Estoque",
			flex: 1,
			renderCell: (params) => (
				<Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#A52A2A" }}>
					<InventoryIcon />
					{params.value}
				</Box>
			),
		},
		{
			field: "actions",
			headerName: "Ações",
			flex: 0.5,
			sortable: false,
			renderCell: (params) => (
				<IconButton color="error" onClick={() => handleDeleteProduct(params.row.id)}>
					<CloseIcon />
				</IconButton>
			),
		},
	];

	const [isMobile, setIsMobile] = useState(false);
	React.useEffect(() => {
		if (typeof window !== "undefined") {
			setIsMobile(window.matchMedia("(max-width:600px)").matches);
		}
	}, []);
	return (
		<Box sx={{ bgcolor: "#f6f8fa", minHeight: "100vh", fontFamily: "Poppins, Roboto, sans-serif" }}>
			<AppBar position="static" elevation={2} sx={{ bgcolor: "#05344a", mb: 5 }}>
				<Toolbar>
					<Avatar sx={{ bgcolor: "#FFA500", mr: 2 }}>
						<ToysIcon sx={{ color: "#05344a" }} />
					</Avatar>
					<Typography variant="h5" sx={{ flexGrow: 1, fontWeight: "bold", letterSpacing: 1 }}>
						Gerenciar Brinquedos PetFarma
					</Typography>
				</Toolbar>
			</AppBar>
			<Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 }, display: "flex", flexDirection: isMobile ? "column" : "row", gap: 4 }}>
				<Box sx={{ flex: 1, minWidth: 320, display: "flex", flexDirection: "column", gap: 4 }}>
					<Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: "#fff" }}>
						<CardContent>
							<Typography variant="h6" sx={{ color: "#008000", fontWeight: "bold", mb: 2 }}>
								Cadastrar Brinquedo
							</Typography>
							<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
								{/* Formulário de cadastro */}
								<TextField
									label="Nome"
									variant="outlined"
									size="small"
									value={newProduct.name}
									onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
									sx={{ bgcolor: "#FFF" }}
								/>
								<Autocomplete
									freeSolo
									options={["Pelúcia", "Bola", "Interativo", "Mordedor"]}
									value={newProduct.category}
									onInputChange={(event, newInputValue) => setNewProduct({ ...newProduct, category: newInputValue })}
									renderInput={(params) => (
										<TextField {...params} label="Categoria" variant="outlined" size="small" sx={{ bgcolor: "#FFF" }} />
									)}
								/>
								{newProduct.category === "Outra" && (
									<TextField
										label="Nova categoria"
										variant="outlined"
										size="small"
										value={newProduct.newCategory || ""}
										onChange={(e) => setNewProduct({ ...newProduct, newCategory: e.target.value })}
										sx={{ bgcolor: "#FFF", mt: 1 }}
									/>
								)}
								<TextField
									label="Descrição"
									variant="outlined"
									size="small"
									value={newProduct.description}
									onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
									sx={{ bgcolor: "#FFF" }}
								/>
								<TextField
									label="Preço"
									variant="outlined"
									size="small"
									value={newProduct.price}
									onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
									sx={{ bgcolor: "#FFF" }}
									type="number"
									inputProps={{ step: "0.01" }}
								/>
								<TextField
									label="Estoque"
									variant="outlined"
									size="small"
									value={newProduct.stock}
									onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
									sx={{ bgcolor: "#FFF" }}
									type="number"
								/>
								<TextField
									label="Imagem (URL ou caminho)"
									variant="outlined"
									size="small"
									value={newProduct.image}
									onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
									sx={{ bgcolor: "#FFF" }}
								/>
								<Button variant="contained" onClick={handleAddProduct} sx={{ bgcolor: "#FFA500", color: "#000", fontWeight: "bold", borderRadius: 2, mt: 1, fontSize: 16, py: 1.2, boxShadow: 2 }}>
									Adicionar
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Box>
				<Box sx={{ flex: 2, minWidth: 320 }}>
					<Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: "#fff", height: "100%" }}>
						<CardContent>
							<Typography variant="h6" sx={{ color: "#A52A2A", fontWeight: "bold", mb: 2 }}>
								Lista de Brinquedos
							</Typography>
							<Box sx={{ position: "relative", mb: 2 }}>
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
									sx={{ bgcolor: "#f6f8fa" }}
									fullWidth
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												{search ? (
													<IconButton onClick={() => setSearch("")} size="small">
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
												<ListItem key={item.id} alignItems="flex-start" sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f6f8fa" } }}>
													<ListItemAvatar>
														{item.img ? (
															<Avatar src={item.img} alt={item.name} />
														) : (
															<Avatar sx={{ bgcolor: "#FFA500", color: "#05344a" }}>
																<ToysIcon fontSize="small" />
															</Avatar>
														)}
													</ListItemAvatar>
													<ListItemText
														primary={<span style={{ fontWeight: 600 }}>{item.name}</span>}
														secondary={<span style={{ color: "#A52A2A", fontWeight: 500 }}>{item.category}</span>}
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
										"& .MuiDataGrid-columnHeaders": {
											backgroundColor: "#FFA500",
											color: "#FFF",
											fontWeight: "bold",
										},
										"& .MuiDataGrid-cell": {
											color: "#000",
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

export default ProdutoBrinquedoPage;
