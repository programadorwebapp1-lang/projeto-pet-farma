// Mock de produtos para a loja de remédios
export type CategoriaRemedio =
  | "Antipulgas e Carrapatos"
  | "Vermífugos"
  | "Antibióticos"
  | "Suplementos e Vitaminas"
  | "Antiinflamatórios"
  | "Ansiedade e Estresse"
  | "Outros";

export interface ProdutoRemedio {
  id: string;
  nome: string;
  preco: number;
  foto: string;
  indicacao: string;
  categoria: CategoriaRemedio;
  labels?: string[];
}

export const remedios: ProdutoRemedio[] = [
  {
    id: "1",
    nome: "Antipulgas NexGard",
    preco: 89.9,
    foto: "/imagens/antipulgas-nexgard.png",
    indicacao: "Para cães",
    categoria: "Antipulgas e Carrapatos",
    labels: ["Promoção", "Mais vendidos"],
  },
  {
    id: "2",
    nome: "Vermífugo Drontal",
    preco: 49.9,
    foto: "/imagens/drontal-vermifugo.png",
    indicacao: "Para cães e gatos",
    categoria: "Vermífugos",
    labels: ["Recomendado pelo veterinário"],
  },
  {
    id: "3",
    nome: "Antibiótico Amoxil",
    preco: 59.9,
    foto: "/imagens/amoxil.png",
    indicacao: "Para cães",
    categoria: "Antibióticos",
  },
  {
    id: "4",
    nome: "Suplemento Ômega 3",
    preco: 39.9,
    foto: "/imagens/omega3.png",
    indicacao: "Para gatos",
    categoria: "Suplementos e Vitaminas",
    labels: ["Mais vendidos"],
  },
  {
    id: "5",
    nome: "Antiinflamatório Carproflan",
    preco: 79.9,
    foto: "/imagens/carproflan.png",
    indicacao: "Para cães e gatos",
    categoria: "Antiinflamatórios",
  },
  {
    id: "6",
    nome: "Calmante Pet Relax",
    preco: 29.9,
    foto: "/imagens/petrelax.png",
    indicacao: "Para cães",
    categoria: "Ansiedade e Estresse",
    labels: ["Promoção"],
  },
  {
    id: "7",
    nome: "Spray Multiuso Pet",
    preco: 19.9,
    foto: "/imagens/petspray.png",
    indicacao: "Para todos os pets",
    categoria: "Outros",
  },
];
