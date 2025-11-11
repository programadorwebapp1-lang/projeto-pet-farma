import React, { useState } from "react";
import { ProdutoRemedio } from "../../mockRemedios";

interface Props {
  produto: ProdutoRemedio;
  onAdd: (produto: ProdutoRemedio, quantidade: number, origem: {x: number, y: number}) => void;
}

export default function ProdutoCard({ produto, onAdd }: Props) {
  const [quantidade, setQuantidade] = useState(1);

  function aumentar() {
    setQuantidade((q) => q + 1);
  }
  function diminuir() {
    setQuantidade((q) => (q > 1 ? q - 1 : 1));
  }

  return (
    <div className="produto-card bg-white rounded-2xl shadow-md p-5 flex flex-col items-center transition-all hover:shadow-xl">
      <div className="w-32 h-32 flex items-center justify-center mb-3">
        <img
          src={produto.foto}
          alt={produto.nome}
          className="produto-img object-contain w-full h-full"
        />
      </div>
      {produto.labels && (
        <div className="flex flex-wrap gap-1 mb-2">
          {produto.labels.map((label) => (
            <span
              key={label}
              className={`selo inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                label === "Promoção"
                  ? "bg-yellow-300 text-yellow-900"
                  : label === "Mais vendidos"
                  ? "bg-green-200 text-green-800"
                  : label === "Recomendado" ||
                    label === "Recomendado pelo veterinário"
                  ? "bg-blue-200 text-blue-800"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      )}
      <div className="produto-nome text-lg font-bold text-center mb-1 text-black ">
        {produto.nome}
      </div>
      <div className="produto-preco text-green-700 text-xl font-bold mb-2 ">
        R$ {produto.preco.toFixed(2)}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <button
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-lg disabled:opacity-50 hover:bg-blue-200 cursor-pointer"
          onClick={diminuir}
          disabled={quantidade === 1}
        >
          -
        </button>
        <span className="px-2 font-medium text-black select-none">
          {quantidade}
        </span>
        <button
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-lg hover:bg-blue-200 cursor-pointer"
          onClick={aumentar}
        >
          +
        </button>
      </div>
      <button
        className="btn-add flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2 font-medium text-base mt-2 transition-all shadow-sm hover:scale-105  cursor-pointer"
        onClick={e => {
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          const origem = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          };
          onAdd(produto, quantidade, origem);
        }}
      >
        <i className="bx bx-cart"></i> Adicionar ao carrinho
      </button>
    </div>
  );
}
