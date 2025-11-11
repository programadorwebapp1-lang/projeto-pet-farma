import React, { useState } from "react";

export default function HeaderDefault() {
  const [resultados, setResultados] = useState<any[]>([]);
  const [buscando, setBuscando] = useState(false);

  async function buscarProdutos(query: string) {
    if (!query) return;
    setBuscando(true);
    try {
      const res = await fetch('/api/produtos?busca=' + encodeURIComponent(query));
      if (!res.ok) throw new Error('Erro na busca');
      const data = await res.json();
      setResultados(Array.isArray(data) ? data : (data?.produtos || []));
    } catch (err) {
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  }

  return (
    <header className="top-header">
      <div className="logo"> #00293b;
        <img src="/imagens/logo.png" alt="PetFarma" />
      </div>
      <div className="search-bar" style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Pesquisar..."
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              const target = e.target as HTMLInputElement;
              await buscarProdutos(target.value);
            }
          }}
        />
        <i
          className="bx bx-search"
          style={{ cursor: 'pointer' }}
          onClick={async () => {
            const input = document.querySelector('.search-bar input') as HTMLInputElement | null;
            if (!input) return;
            await buscarProdutos(input.value);
          }}
        ></i>
        {buscando && (
          <div style={{ position: 'absolute', top: '110%', left: 0, background: '#fff', width: '100%', zIndex: 10, border: '1px solid #eee', padding: 8 }}>
            Buscando...
          </div>
        )}
        {resultados.length > 0 && !buscando && (
          <ul style={{ position: 'absolute', top: '110%', left: 0, background: '#fff', width: '100%', zIndex: 10, border: '1px solid #eee', maxHeight: 250, overflowY: 'auto', margin: 0, padding: 8, listStyle: 'none' }}>
            {resultados.map((item, idx) => (
              <li
                key={item.id || idx}
                style={{ padding: 4, borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                onClick={() => {
                  window.location.href = '/remedios';
                }}
              >
                {item.nome || item.titulo || JSON.stringify(item)}
              </li>
            ))}
          </ul>
        )}
        {resultados.length === 0 && !buscando && (
          <></>
        )}
      </div>
      <div className="user-cart">
        <a href="/carrinho">
          <i className="bx bx-cart-add"></i>
          <span>Carrinho</span>
        </a>
        <div className="user">
          <i className="bx bxs-user"></i>
          <a href="/login">Entrar</a> / <a href="/cadastro">Cadastre-se</a>
        </div>
      </div>
    </header>
  );
}
