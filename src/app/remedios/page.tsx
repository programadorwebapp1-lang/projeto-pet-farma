// Página principal da loja de remédios

"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import GatinhoAnimacao from "../../components/GatinhoAnimacao";
import SearchIcon from "../../components/SearchIcon";
import "./gatinhoAnimacao.css";
import FiltroCategorias from "../../components/remedios/FiltroCategorias";
import ProdutoCard from "../../components/remedios/ProdutoCard";
import CarrinhoDrawer from "../../components/remedios/CarrinhoDrawer";
import { useCarrinho } from "../../context/CarrinhoContext";
import { Avatar } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import api from '../../service/api';


export default function RemediosShopPage() {
  const [busca, setBusca] = useState("");
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [produtos, setProdutos] = useState([]); // Produtos vindos da API
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]);
  const { adicionar } = useCarrinho();
  const [gatinhoAtivo, setGatinhoAtivo] = useState(false);
  const [gatinhoOrigem, setGatinhoOrigem] = useState(null);
  const [gatinhoDestino, setGatinhoDestino] = useState(null);
  const carrinhoRef = useRef(null);

  // Buscar produtos e categorias da API ao montar
  useEffect(() => {
    async function fetchProdutosECategorias() {
      try {
        const response = await api.get('/remedios/');
        const apiProdutos = response.data.data.map((item) => ({
          id: item.ID,
          nome: item.NOME,
          categoria: item.DESCRICAO,
          preco: item.PRECO,
          estoque: item.ESTOQUE,
          foto: item.FOTO || '',
        }));
        setProdutos(apiProdutos);
        // Extrair categorias únicas dos produtos
        const cats = Array.from(new Set(apiProdutos.map(p => p.categoria))).filter(Boolean);
        setCategoriasDisponiveis(cats);
      } catch (error) {
        setProdutos([]);
        setCategoriasDisponiveis([]);
      }
    }
    fetchProdutosECategorias();
  }, []);

  // Sugestões de busca vindas da API
  const sugestoes = useMemo(() => {
    if (busca.trim() === "") return [];
    return produtos.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase())).slice(0, 5);
  }, [busca, produtos]);

  // Produtos filtrados por busca e categoria
  const produtosFiltrados = useMemo(() => {
    let filtrados = produtos;
    if (categoriasSelecionadas.length > 0) {
      filtrados = filtrados.filter((p) => categoriasSelecionadas.includes(p.categoria));
    }
    if (busca.trim() !== "") {
      filtrados = filtrados.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()));
    }
    return filtrados;
  }, [busca, categoriasSelecionadas, produtos]);

  function handleAdd(produto, quantidade, origem) {
    adicionar(produto, quantidade);
    setGatinhoOrigem(origem);
    if (carrinhoRef.current) {
      const rect = carrinhoRef.current.getBoundingClientRect();
      setGatinhoDestino({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    }
    setGatinhoAtivo(true);
  }

  return (
  <main className="min-h-screen bg-white flex flex-col">
      <GatinhoAnimacao
        mostrar={gatinhoAtivo}
        origem={gatinhoOrigem}
        destino={gatinhoDestino}
        onFim={() => setGatinhoAtivo(false)}
      />
      <header className="w-full p-4 bg-green-600 text-white text-2xl font-bold flex items-center justify-between">
        <span className="petfarma-logo flex items-center">
          <Avatar sx={{ bgcolor: '#FFA500', mr: 2 }}>
            <PetsIcon sx={{ color: '#05344a' }} />
          </Avatar>
        </span>
        <span>
          <button
            ref={carrinhoRef}
            className="carrinho-btn"
            title="Abrir carrinho"
          >
            <CarrinhoDrawer />
          </button>
        </span>
      </header>
      {/* Campo de busca de remédios (agora usando produtos da API) */}
      <div className="mb-6 flex justify-center">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            value={busca}
            onChange={e => {
              setBusca(e.target.value);
              setShowSugestoes(true);
            }}
            onFocus={() => setShowSugestoes(true)}
            onBlur={() => setTimeout(() => setShowSugestoes(false), 150)}
            placeholder="Buscar remédio..."
            className="w-full px-5 py-3 pr-12 rounded-full border-2 border-green-600 shadow-md focus:outline-none focus:border-orange-400 focus:shadow-lg text-lg transition-all duration-200 bg-white placeholder:text-black text-black  "
            autoComplete="off"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black cursor-pointer">
            <SearchIcon size={28} color="#FFA500" />
          </span>
          {/* Dropdown de sugestões usando produtos da API */}
          {showSugestoes && sugestoes.length > 0 && (
            <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 cursor-pointer ">
              {sugestoes.map((sugestao) => (
                <button
                  key={sugestao.id}
                  type="button"
                  className="flex items-center w-full px-4 py-3 text-lg hover:bg-gray-100 text-left gap-3 cursor-pointer "
                  onMouseDown={() => {
                    setBusca(sugestao.nome);
                    setShowSugestoes(false);
                  }}
                >
                  <img src={sugestao.foto} alt={sugestao.nome} className="w-8 h-8 rounded bg-gray-100 border mr-2"/>
                  <span className="font-bold text-gray-700">{sugestao.nome}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <section className="flex flex-1">
        <div className="w-1/4 p-4 border-r hidden md:block ">
          <FiltroCategorias
            categorias={categoriasDisponiveis}
            selecionadas={categoriasSelecionadas}
            onChange={setCategoriasSelecionadas}
          />
        </div>
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 curosor-pointer">
            {produtosFiltrados.map((produto) => (
              <ProdutoCard
                key={produto.id}
                produto={produto}
                onAdd={handleAdd}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
