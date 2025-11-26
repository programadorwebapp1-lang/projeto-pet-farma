"use client";
import Image from 'next/image';
import { useState } from 'react';
import './petfarma-gato.css';

export default function GatoPage() {
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
    <main className="gato-main">
      <h1 className="gato-titulo">
        Adote seu Novo Melhor Amigo na <span>Petfarma</span> 🐱
      </h1>
      <section className="gato-imagens">
        <Image src="/imagens/cuidados-filhote-de-gato.jpg" alt="Gato 1" width={180} height={120} className="gato-img" />
        <Image src="/imagens/cuidados-filhote-de-gato.jpg" alt="Gato 2" width={180} height={120} className="gato-img" />
        <Image src="/imagens/cuidados-filhote-de-gato.jpg" alt="Gato 3" width={180} height={120} className="gato-img" />
      </section>
      <div className="gato-info">
        <p>Se você procura um gato saudável, carinhoso e pronto para trazer alegria ao seu lar, está no lugar certo! Na <b>Petfarma</b>, trabalhamos com criadores responsáveis e comprometidos em oferecer filhotes de alta qualidade para todos os tipos de família.</p>
        <ul className="gato-lista">
          <li><b>Filhotes saudáveis e bem tratados:</b> Todos os gatos são criados em ambientes acolhedores e com cuidados veterinários contínuos.</li>
          <li><b>Variedade de raças:</b> Encontre o gato perfeito para o seu estilo de vida, seja ele mais brincalhão, tranquilo, peludo ou exótico!</li>
          <li><b>Compra online simples e segura:</b> Compre seu filhote de forma prática, com facilidade de pagamento e entrega rápida.</li>
          <li><b>Atenção personalizada:</b> Nossa equipe está pronta para ajudar você a escolher o filhote ideal, garantindo uma experiência de compra tranquila.</li>
        </ul>
      </div>
      <section className="gato-disponivel">
        <h2>Filhotes Disponíveis</h2>
        <div className="gato-disponivel-dados">
          <b>Raça:</b> Persa<br />
          <b>Idade:</b> 2 meses<br />
          <b>Temperamento:</b> Calmo, afetuoso, ideal para ambientes tranquilos<br />
          <b>Vacinas e Vermifugação:</b> Todas em dia<br />
          <b>Garantia de saúde:</b> Atestado veterinário incluso
        </div>
        <button className="gato-btn">
          Comprar filhote
        </button>
        <button className="gato-btn-outline">
          Falar com especialista
        </button>
      </section>
      <section className="gato-contato">
        <h2>Formulário de Contato</h2>
        {enviado ? (
          <div className="gato-sucesso">Mensagem enviada com sucesso! Entraremos em contato.</div>
        ) : null}
        <form onSubmit={handleSubmit} className="gato-form">
          <input
            type="text"
            name="nome"
            placeholder="Seu nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="gato-input"
          />
          <input
            type="email"
            name="email"
            placeholder="Seu e-mail"
            value={form.email}
            onChange={handleChange}
            required
            className="gato-input"
          />
          <textarea
            name="mensagem"
            placeholder="Sua mensagem"
            value={form.mensagem}
            onChange={handleChange}
            required
            rows={4}
            className="gato-textarea"
          />
          <button type="submit" className="gato-form-btn">
            Enviar mensagem
          </button>
        </form>
      </section>
      <div className="gato-rodape">
        Entre em contato para mais informações e para garantir o seu filhote!
      </div>
    </main>
  );
}
