import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const busca = searchParams.get('busca')?.toLowerCase() || '';
  try {
    // Busca os produtos da API externa
    const response = await fetch('https://api-farmpet.onrender.com/remedios/', {
      cache: 'no-store',
    });
    const data = await response.json();
    // Espera que a API retorne um array em data.data
    const produtos = Array.isArray(data.data) ? data.data : [];
    // Filtra pelo nome
    const resultados = produtos
      .filter(produto =>
        produto.NOME && produto.NOME.toLowerCase().includes(busca)
      )
      .map(produto => ({
        id: produto.ID,
        nome: produto.NOME,
        tipo: produto.DESCRICAO,
        imagem: produto.IMAGEM || '/public/imagens/remedio-default.png',
      }));
    return NextResponse.json(resultados);
  } catch (e) {
    return NextResponse.json([]);
  }
}
