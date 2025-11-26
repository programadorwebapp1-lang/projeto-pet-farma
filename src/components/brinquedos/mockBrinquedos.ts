// Mock de brinquedos e categorias

export type CategoriaBrinquedo = "Pelúcia" | "Bola" | "Interativo" | "Mordedor";

export interface Brinquedo {
  id: number;
  nome: string;
  categoria: CategoriaBrinquedo;
  preco: number;
  imagem: string;
}

export const brinquedos: Brinquedo[] = [
  {
    id: 1,
    nome: "Urso de Pelúcia",
    categoria: "Pelúcia",
    preco: 49.9,
    imagem: "/imagens/urso-pelucia.png",
  },
  {
    id: 2,
    nome: "Bola Colorida",
    categoria: "Bola",
    preco: 19.9,
    imagem: "/imagens/bola-colorida.png",
  },
  {
    id: 3,
    nome: "Brinquedo Interativo",
    categoria: "Interativo",
    preco: 39.9,
    imagem: "/imagens/brinquedo-interativo.png",
  },
  {
    id: 4,
    nome: "Mordedor de Borracha",
    categoria: "Mordedor",
    preco: 14.9,
    imagem: "/imagens/mordedor-borracha.png",
  },
];
