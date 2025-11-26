// Página principal da loja de brinquedos

"use client";
import React, { useState, useMemo, useEffect } from "react";
import FiltroCategoriasBrinquedos from "../../components/brinquedos/FiltroCategoriasBrinquedos";
import ProdutoCardBrinquedo from "../../components/brinquedos/ProdutoCardBrinquedo";
import "./searchInputCustom.css";
import SearchIcon from "../../components/SearchIcon";
import CarrinhoBrawer from "../../components/brinquedos/CarrinhoBrawer";
import { useCarrinho } from "../../context/CarrinhoContext";
import { Avatar } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import api from '../../service/api';

export default function BrinquedosShopPage() {
  const [produtos, setProdutos] = useState([]); // Produtos da API
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState([]); // Categorias da API
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [busca, setBusca] = useState("");
  const [showSugestoes, setShowSugestoes] = useState(false);
  const { adicionar } = useCarrinho();

  useEffect(() => {
    async function fetchBrinquedosECategorias() {
      try {
        const response = await api.get('/brinquedos/');
        const apiBrinquedos = response.data.data.map((item) => ({
          id: item.ID,
          nome: item.NOME,
          categoria: item.DESCRICAO,
          preco: item.PRECO,
          imagem: item.IMAGEM || '',
        }));
        setProdutos(apiBrinquedos);
        // Extrair categorias únicas dos produtos
        const cats = Array.from(new Set(apiBrinquedos.map(p => p.categoria))).filter(Boolean);
        setCategoriasDisponiveis(cats);
      } catch (error) {
        setProdutos([]);
        setCategoriasDisponiveis([]);
      }
    }
    fetchBrinquedosECategorias();
  }, []);

  const produtosFiltrados = useMemo(() => {
    let filtrados = produtos;
    if (categoriasSelecionadas.length > 0) {
      filtrados = filtrados.filter((p) => categoriasSelecionadas.includes(p.categoria));
    }
    if (busca.trim() !== "") {
      filtrados = filtrados.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()));
    }
    return filtrados;
  }, [produtos, categoriasSelecionadas, busca]);

  // Sugestões para dropdown
  const sugestoes = useMemo(() => {
    if (busca.trim() === "") return [];
    return produtos.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase())).slice(0, 5);
  }, [busca, produtos]);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <header className="w-full p-4 bg-green-600 text-white text-2xl flex items-center justify-between">
        <span className="petfarma-logo flex items-center">
          <Avatar sx={{ bgcolor: '#FFA500', mr: 2 }}>
            <PetsIcon sx={{ color: '#05344a' }} />
          </Avatar>
        </span>
        <CarrinhoBrawer />
      </header>
      <section className="flex flex-1">
        <div className="w-1/4 p-4 border-r hidden md:block">
          <FiltroCategoriasBrinquedos
            categorias={categoriasDisponiveis}
            selecionadas={categoriasSelecionadas}
            onChange={setCategoriasSelecionadas}
          />
        </div>
        <div className="flex-1 p-4">
          {/* Campo de busca personalizado acima da grid de produtos */}
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
                placeholder="Buscar brinquedo..."
                className="w-full px-2 py-3 pr-12 rounded-full border-2 border-orange-400 focus:outline-none focus:border-green-600 focus:shadow-lg text-lg transition-all duration-200 bg-white text-black search-input-custom"
                autoComplete="off"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-black pointer-events-none">
                <SearchIcon size={28} color="#FFA500" />
              </span>
              {/* Dropdown de sugestões */}
              {showSugestoes && sugestoes.length > 0 && (
                <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10 cursor-pointer  ">
                  {sugestoes.map((sugestao) => (
                    <button
                      key={sugestao.id}
                      type="button"
                      className="flex items-center w-full px-4 py-3 text-lg hover:bg-gray-100 text-left gap-3 cursor-pointer"
                      onMouseDown={() => {
                        setBusca(sugestao.nome);
                        setShowSugestoes(false);
                      }}
                    >
                      <img src={sugestao.imagem} alt={sugestao.nome} className="w-8 h-8 rounded bg-gray-100 border mr-2" />
                      <span className="text-gray-500">
                        <SearchIcon size={22} color="#05344a" />
                      </span>
                      <span className="font-bold text-gray-700">{sugestao.nome}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {produtosFiltrados.map((produto) => (
              <ProdutoCardBrinquedo
                key={produto.id}
                produto={produto}
                onAdd={(produto, quantidade) => adicionar(produto, quantidade)}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
