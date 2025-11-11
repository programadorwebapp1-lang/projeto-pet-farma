import React, { useState } from "react";
import { brinquedos } from "../brinquedos/mockBrinquedos";
import { remedios } from "../../mockRemedios";
import { useCarrinho } from "../../context/CarrinhoContext";

function HeaderRemedios({ onBuscar = undefined, carrinho, onCarrinhoClick }) {
  const [busca, setBusca] = useState("");
  const [showSugestoes, setShowSugestoes] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);
  // Busca sugestões na API sempre que o texto mudar
  React.useEffect(() => {
    if (busca.trim() === "") {
      setSugestoes([]);
      return;
    }
    // Substitua a URL abaixo pela URL real da sua API
    fetch(`/api/produtos?busca=${encodeURIComponent(busca)}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        // Espera-se que a API retorne um array de produtos com { id, nome, tipo, imagem }
        setSugestoes(Array.isArray(data) ? data.slice(0, 5) : []);
      })
      .catch(() => setSugestoes([]));
  }, [busca]);
  return (
    <header className="w-full px-4 py-3 bg-green-700 flex items-center justify-between flex-wrap gap-2 relative">
      <span className="min-w-[180px]">Pet Farma - Remédios</span>
      <form
        className="flex-1 flex justify-center min-w-[180px]"
        onSubmit={e => {
          e.preventDefault();
          onBuscar?.(busca);
        }}
      >
        <div className="relative w-full max-w-md">
          <input
            type="search"
            value={busca}
            onChange={e => {
              setBusca(e.target.value);
              setShowSugestoes(true);
            }}
            onFocus={() => setShowSugestoes(true)}
            onBlur={() => setTimeout(() => setShowSugestoes(false), 150)}
            placeholder="Buscar produtos..."
            className="w-full rounded-full border-none px-4 py-2 pr-10 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder:text-gray-400 shadow-sm font-normal"
            autoComplete="off"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="7" stroke="#888" strokeWidth="2"/><path d="M15 15l-3-3" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
          </span>
          {/* Dropdown de sugestões vindas da API */}
          {showSugestoes && sugestoes.length > 0 && (
            <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-10">
              {sugestoes.map(sugestao => (
                <button
                  key={sugestao.id}
                  type="button"
                  className="flex items-center w-full px-4 py-4 text-lg hover:bg-gray-100 text-left gap-3 cursor-pointer"
                  onMouseDown={() => {
                    setBusca(sugestao.nome);
                    setShowSugestoes(false); 
                  }}
                >
                  <img src={sugestao.imagem} alt={sugestao.nome} className="w-8 h-8 rounded bg-gray-100 border mr-2" />
                  <span className="font-bold text-gray-700">{sugestao.nome}</span>
                  <span className="ml-2 text-xs text-gray-400">{sugestao.tipo}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </form>
      <button
        className="cart-btn relative ml-2 text-[#ff6600] hover:opacity-80 transition-opacity duration-150 cursor-pointer"
        onClick={onCarrinhoClick}
        aria-label="Abrir carrinho"
      >
        <i  className='bx bx-cart-add text-3xl'></i>
        {carrinho.length > 0 && (
          <span className="cart-badge absolute-top-2 -right-2 bg-[#ff6600] text-white text-xs rounded-full px-2 py-0.5 font-bold cursor-pointer">
            {carrinho.reduce((acc, item) => acc + item.quantidade, 0)}
          </span>
        )}
      </button>
    </header>
  );
}

export default function CarrinhoDrawer() {
  const {
    carrinho,
    remover,
    alterarQuantidade,
    total,
    limpar,
    checkout,
    pedidoConfirmado,
    setPedidoConfirmado,
  } = useCarrinho();
  const [aberto, setAberto] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [form, setForm] = useState({ nome: "", endereco: "", pagamento: "Pix", parcelas: 1 });
  const [pedidoId, setPedidoId] = useState<string | null>(null);

  function handleFinalizar() {
    setCheckoutMode(true);
  }
  function handleConfirmar(e: React.FormEvent) {
    e.preventDefault();
    const pedido = checkout(
      form.nome,
      form.endereco,
      form.pagamento,
      form.pagamento === "Cartão de Crédito" ? form.parcelas : undefined
    );
    setPedidoId(pedido.id);
    setCheckoutMode(false);
  }
  function handleFechar() {
    setAberto(false);
    setCheckoutMode(false);
    setPedidoId(null);
    setPedidoConfirmado(undefined);
  }

  return (
    <>
      <HeaderRemedios carrinho={carrinho} onCarrinhoClick={() => setAberto((a) => !a)} />
      {aberto && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={handleFechar} />
      )}
      <aside
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          aberto ? "translate-x-0" : "translate-x-full"
        } rounded-l-2xl flex flex-col`}
        aria-label="Carrinho lateral"
      >
        <div className="flex justify-between items-center p-5 border-b bg-blue-50 rounded-tl-2xl">
          <h2 className="text-xl font-bold text-blue-700 flex items-center gap-2">
            <i className="bx bx-cart text-2xl text-blue-600"></i> Carrinho
          </h2>
          <button onClick={handleFechar} aria-label="Fechar" className="text-2xl text-blue-600 hover:text-blue-800 cursor-pointer">✕</button>
        </div>
        {pedidoId ? (
          <div className="p-6 flex flex-col items-center justify-center flex-1">
            <span className="text-green-600 font-bold text-xl mb-2">Pedido confirmado!</span>
            <span className="text-sm mb-4">ID do pedido: <b>{pedidoId}</b></span>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium shadow" onClick={handleFechar}>Fechar</button>
          </div>
        ) : checkoutMode ? (
          <form className="p-6 flex flex-col gap-3 flex-1" onSubmit={handleConfirmar}>
            <label className="text-sm font-medium text-blue-700">
              Nome do tutor
              <input
                className="border border-blue-200 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-300 outline-none"
                required
                value={form.nome}
                onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
              />
            </label>
            <label className="text-sm font-medium text-blue-700">
              Endereço
              <input
                className="border border-blue-200 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-300 outline-none"
                required
                value={form.endereco}
                onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))}
              />
            </label>
            <label className="text-sm font-medium text-blue-700">
              Forma de pagamento
              <select
                className="border border-blue-200 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-300 outline-none"
                value={form.pagamento}
                onChange={e => setForm(f => ({ ...f, pagamento: e.target.value, parcelas: 1 }))}
              >
                <option>Pix</option>
                <option>Cartão de Crédito</option>
              </select>
            </label>
            {form.pagamento === "Cartão de Crédito" && (
              <label className="text-sm font-medium text-blue-700">
                Parcelas
                <select
                  className="border border-blue-200 rounded-lg w-full p-2 mt-1 focus:ring-2 focus:ring-blue-300 outline-none"
                  value={form.parcelas}
                  onChange={e => setForm(f => ({ ...f, parcelas: Number(e.target.value) }))}
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}x</option>
                  ))}
                </select>
              </label>
            )}
            <button className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow transition-all" type="submit">
              Confirmar Pedido
            </button>
          </form>
        ) : (
          <div className="flex flex-col h-full flex-1">
            <div className="flex-1 overflow-y-auto p-5">
              {carrinho.length === 0 ? (
                <span className="text-gray-400 text-center block mt-10">Seu carrinho está vazio.</span>
              ) : (
                <ul className="space-y-5">
                  {carrinho.map((item) => (
                    <li key={item.produto.id} className="flex items-center gap-3 bg-blue-50 rounded-xl p-3 hover:bg-blue-100 transition-colors duration-150 cursor-pointer">
                      <img
                        src={"foto" in item.produto ? item.produto.foto : ("imagem" in item.produto ? item.produto.imagem : "")}
                        alt={item.produto.nome}
                        className="w-14 h-14 rounded-lg object-contain bg-white border"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-blue-800 block">{item.produto.nome}</span>
                        <div className="text-xs text-blue-500">R$ {item.produto.preco.toFixed(2)}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <button
                            className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold text-lg disabled:opacity-50 hover:bg-blue-200 cursor-pointer"
                            onClick={() => alterarQuantidade(item.produto.id, item.quantidade - 1)}
                            disabled={item.quantidade === 1}
                          >-</button>
                          <span className="px-2 font-medium text-black">{item.quantidade}</span>
                          <button
                            className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-bold text-lg hover:bg-blue-200 cursor-pointer"
                            onClick={() => alterarQuantidade(item.produto.id, item.quantidade + 1)}
                          >+</button>
                        </div>
                      </div>
                      <button
                        className="text-red-500 ml-2 hover:text-red-700 text-xl cursor-pointer"
                        onClick={() => remover(item.produto.id)}
                        aria-label="Remover"
                      >
                        <i className="bx bx-trash"></i>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t p-5 bg-white rounded-b-2xl">
              <div className="flex justify-between font-bold text-lg mb-2">
                <span className="text-black">Total:</span>
                <span className="text-green-700">R$ {total.toFixed(2)}</span>
              </div>
              <button
                className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold shadow disabled:opacity-50 transition-all cursor-pointer"
                disabled={carrinho.length === 0}
                onClick={handleFinalizar}
              >
                Finalizar compra
              </button>
              <button
                className="mt-2 w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium hover:bg-blue-200 disabled:opacity-50 cursor-pointer"
                onClick={limpar}
                disabled={carrinho.length === 0}
              >
                Limpar carrinho
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
