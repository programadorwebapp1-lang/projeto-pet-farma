import React from "react";

interface Props {
  categorias: string[];
  selecionadas: string[];
  onChange: (cats: string[]) => void;
}

export default function FiltroCategorias({ categorias, selecionadas, onChange }: Props) {
  function toggle(cat: string) {
    if (selecionadas.includes(cat)) {
      onChange(selecionadas.filter((c) => c !== cat));
    } else {
      onChange([...selecionadas, cat]);
    }
  }
  return (
    <aside className="sidebar flex flex-col gap-2 bg-[#fffff] rounded-2xl shadow-lg p-4 ">
      <span className="font-bold text-blue-700 text-lg mb-2 ml-2 cursor-text">Categorias</span>
      <ul className="flex flex-col gap-2">
        {categorias.map((cat) => (
          <li key={cat}>
            <button
              className={`category-btn flex items-center gap-3 px-2 py-2 rounded-xl transition-all text-base font-medium w-full text-left cursor-pointer ${
                  selecionadas.includes(cat)
                  ? "bg-blue-50 text-blue-700 cursor-pointer"
                  : "text-blue-600 hover:bg-blue-50 "
              }`}
              onClick={() => toggle(cat)}
              aria-pressed={selecionadas.includes(cat) ? true : false}
            >
              {/* Ícone pode ser adicionado aqui se desejar associar por nome */}
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
