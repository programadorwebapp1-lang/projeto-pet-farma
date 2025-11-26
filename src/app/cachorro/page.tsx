"use client";
import Image from 'next/image';
import { useState } from 'react';
import './petfarma-cachorro.css';

export default function CachorroPage() {
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setEnviado(true);
    // Aqui você pode integrar com backend ou serviço de email
  }

  return (
    <main className="cachorro-main">
      <h1 className="cachorro-titulo">
        Adote seu Novo Melhor Amigo na <span>Petfarma</span> 🐶
      </h1>
      <section className="cachorro-imagens">
        <Image src="/imagens/cuidados-filhote-de-cachorro.jpg" alt="Cachorro 1" width={180} height={120} className="cachorro-img" />
        <Image src="/imagens/cuidados-filhote-de-cachorro.jpg" alt="Cachorro 2" width={180} height={120} className="cachorro-img" />
        <Image src="/imagens/cuidados-filhote-de-cachorro.jpg" alt="Cachorro 3" width={180} height={120} className="cachorro-img" />
      </section>
      <div className="cachorro-info">
        <p>Se você está em busca de um cachorro saudável, carinhoso e pronto para fazer parte da sua vida, você está no lugar certo! Na <b>Petfarma</b>, trabalhamos com criadores responsáveis e comprometidos em oferecer filhotes de alta qualidade para todos os tipos de família.</p>
        <ul className="cachorro-lista">
          <li><b>Filhotes saudáveis e bem tratados:</b> Todos os cães são criados em ambientes acolhedores e com cuidados veterinários contínuos.</li>
          <li><b>Variedade de raças:</b> Encontre o cachorro perfeito para o seu estilo de vida, seja ele mais ativo, tranquilo, pequeno ou grande!</li>
          <li><b>Compra online simples e segura:</b> Compre seu filhote de forma prática, com facilidade de pagamento e entrega rápida.</li>
          <li><b>Atenção personalizada:</b> Nossa equipe está pronta para ajudar você a escolher o filhote ideal, garantindo uma experiência de compra tranquila.</li>
        </ul>
      </div>
      <section className="cachorro-disponivel">
        <h2>Filhotes Disponíveis</h2>
        <div className="cachorro-disponivel-dados">
          <b>Raça:</b> Golden Retriever<br />
          <b>Idade:</b> 3 meses<br />
          <b>Temperamento:</b> Sociável, brincalhão, ideal para famílias com crianças<br />
          <b>Vacinas e Vermifugação:</b> Todas em dia<br />
          <b>Garantia de saúde:</b> Atestado veterinário incluso
        </div>
        <button className="cachorro-btn">
          Comprar filhote
        </button>
        <button className="cachorro-btn-outline">
          Falar com especialista
        </button>
      </section>
      <section className="cachorro-contatoo">
        <h2>Formulário de Contato</h2>
        {enviado ? (
          <div className="cachorro-sucesso">Mensagem enviada com sucesso! Entraremos em contato.</div>
        ) : null}
        <form onSubmit={handleSubmit} className="cachorro-form">
          <input
            type="text"
            name="nome"
            placeholder="Seu nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="cachorro-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={form.email}
            onChange={handleChange}
            required
            className="cachorro-input"
          />
          <textarea
            name="mensagem"
            placeholder="Sua mensagem"
            value={form.mensagem}
            onChange={handleChange}
            required
            rows={4}
            className="cachorro-textarea"
          />
          <button type="submit" className="cachorro-form-btn">
            Enviar mensagem
          </button>
        </form>
      </section>
      <div className="cachorro-rodape">
        Entre em contato para mais informações e para garantir o seu filhote!
      </div>
    </main>
  );
}
