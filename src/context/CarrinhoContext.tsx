'use client';
import React, { createContext, useContext, useState, ReactNode } from "react";
import { ProdutoRemedio } from "../mockRemedios";
import { Brinquedo } from "../components/brinquedos/mockBrinquedos";

export type ProdutoCarrinho = ProdutoRemedio | Brinquedo;

export interface CarrinhoItem {
  produto: ProdutoCarrinho;
  quantidade: number;
}

interface Pedido {
  id: string;
  itens: CarrinhoItem[];
  nomeTutor: string;
  endereco: string;
  pagamento: string;
  total: number;
  parcelas?: number;
}

interface CarrinhoContextType {
  carrinho: CarrinhoItem[];
  adicionar: (produto: ProdutoCarrinho, quantidade?: number) => void;
  remover: (produtoId: string | number) => void;
  alterarQuantidade: (produtoId: string | number, quantidade: number) => void;
  limpar: () => void;
  total: number;
  checkout: (nomeTutor: string, endereco: string, pagamento: string, parcelas?: number) => Pedido;
  pedidoConfirmado?: Pedido;
  setPedidoConfirmado: (pedido?: Pedido) => void;
}

const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

export function useCarrinho() {
  const ctx = useContext(CarrinhoContext);
  if (!ctx) throw new Error("useCarrinho deve ser usado dentro do CarrinhoProvider");
  return ctx;
}

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);
  const [pedidoConfirmado, setPedidoConfirmado] = useState<Pedido | undefined>();

  const adicionar = (produto: ProdutoCarrinho, quantidade: number = 1) => {
    setCarrinho((prev) => {
      const existe = prev.find((item) => item.produto.id === produto.id);
      if (existe) {
        return prev.map((item) =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      }
      return [...prev, { produto, quantidade }];
    });
  };

  const remover = (produtoId: string | number) => {
    setCarrinho((prev) => prev.filter((item) => item.produto.id !== produtoId));
  };

  const alterarQuantidade = (produtoId: string | number, quantidade: number) => {
    setCarrinho((prev) =>
      prev.map((item) =>
        item.produto.id === produtoId ? { ...item, quantidade } : item
      ).filter((item) => item.quantidade > 0)
    );
  };

  const limpar = () => setCarrinho([]);

  const total = carrinho.reduce(
    (acc, item) => acc + item.produto.preco * item.quantidade,
    0
  );

  const checkout = (nomeTutor: string, endereco: string, pagamento: string): Pedido => {
    const pedido: Pedido = {
      id: Math.random().toString(36).substring(2, 10),
      itens: carrinho,
      nomeTutor,
      endereco,
      pagamento,
      total,
      parcelas: pagamento === "Cartão de Crédito" ? arguments[3] : undefined,
    };
    setPedidoConfirmado(pedido);
    limpar();
    return pedido;
  };

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        adicionar,
        remover,
        alterarQuantidade,
        limpar,
        total,
        checkout,
        pedidoConfirmado,
        setPedidoConfirmado,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}
