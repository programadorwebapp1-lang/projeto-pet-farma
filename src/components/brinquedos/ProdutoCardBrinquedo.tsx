import React from "react";
import { Brinquedo } from "./mockBrinquedos";

interface ProdutoCardBrinquedoProps {
  produto: Brinquedo;
  onAdd: (produto: Brinquedo, quantidade: number) => void;
}

export default function ProdutoCardBrinquedo({ produto, onAdd }: ProdutoCardBrinquedoProps) {
  const [quantidade, setQuantidade] = React.useState(1);

  return (
    <div className="border rounded-lg p-4 flex flex-col items-center shadow hover:shadow-lg transition">
      <img
        src={produto.imagem}
        alt={produto.nome}
        className="w-32 h-32 object-contain mb-2"
      />
      <h3 className="font-bold text-black mb-1 text-center">{produto.nome}</h3>
      <p className="text-gray-600 text-sm mb-2 text-center">Categoria: {produto.categoria}</p>
      <span className="text-green-700 font-bold text-xl mb-2">R$ {produto.preco.toFixed(2)}</span>
      <div className="flex flex-col items-center gap-2 mb-2">
        <div className="flex items-center gap-2 mb-2">
          <button
            className="w-10 h-10 rounded-full bg-blue-100 cursor-pointer text-blue-500 text-2xl flex items-center justify-center hover:bg-blue-200 transition"
            onClick={() => setQuantidade(q => Math.max(1, q - 1))}
            aria-label="Diminuir quantidade"
          >
            -
          </button>
          <span className="mx-2 text-black select-none quantidade-span">{quantidade}</span>
          <button
            className="w-10 h-10 rounded-full bg-blue-100 cursor-pointer text-blue-500 text-2xl flex items-center justify-center hover:bg-blue-200 transition"
            onClick={() => setQuantidade(q => q + 1)}
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-green-700 transition"
          onClick={() => onAdd(produto, quantidade)}
        >
          Adicionar ao carrinho
        </button>
      </div>

    </div>
  );
}
