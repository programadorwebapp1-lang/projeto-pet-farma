
'use client';

import Link from "next/link";
import "./servicos.css";

export default function ServicosPage() {
  return (
    <main className="servicos-main">
      {/* Cabeçalho */}
      <header className="servicos-header">
        <div className="servicos-header-top">
            <img src="/imagens/logo petfarma.png" alt="Logo Petfarma" className="servicos-logo" />
          <div className="servicos-header-actions">
            <Link href="/agendar" className="servicos-btn servicos-btn-cta">Agendar Agora</Link>
          </div>
        </div>
        <nav className="servicos-nav">
          <Link href="/"><span className="servicos-nav-icon">🏠</span> Home</Link>
        </nav>
      </header>

      {/* Introdução */}
      <section className="servicos-intro">
        <div className="servicos-intro-img">
          <img src="/imagens/servicos.png" alt="Cãozinho no banho feliz" style={{width: '100%', maxWidth: 400, height: 'auto', objectFit: 'cover', borderRadius: 24}} />
        </div>
        <div className="servicos-intro-text">
          <h1>Oferecemos cuidados completos para seu pet com carinho e profissionalismo</h1>
          <p>
            Na Pet Farma, oferecemos serviços de alta qualidade para garantir a saúde e felicidade do seu pet.<br />
            Profissionais especializados, ambiente seguro e atendimento personalizado.
          </p>
        </div>
      </section>

      {/* Serviços */}
      <section className="servicos-lista">
        <h2>Nossos Serviços</h2>
        <div className="servicos-grid">
          <div className="servico-card">
            <img src="/imagens/clínica-veteriná.png" alt="Consultas Veterinárias" />
            <h3>Consultas Veterinárias</h3>
            <p>Atendimento clínico completo para cães, gatos e outros pets, com profissionais experientes.</p>
          </div>
          <div className="servico-card">
            <img src="/imagens/ambiente-de-banho.png" alt="Banho e Tosa" />
            <h3>Banho e Tosa</h3>
            <p>Serviço de higiene e estética com produtos de alta qualidade e ambiente seguro.</p>
          </div>
          <div className="servico-card">
            <img src="/imagens/cena-de-adoção.png" alt="Adoção Responsável" />
            <h3>Adoção Responsável</h3>
            <p>Ajude um pet a encontrar um lar! Adoção consciente e acompanhamento pós-adoção.</p>
          </div>
          <div className="servico-card">
            <img src="/imagens/cena-de-vacinaçã.png" alt="Vacinação e Vermifugação" />
            <h3>Vacinação e Vermifugação</h3>
            <p>Proteja seu pet contra doenças com vacinas e vermífugos aplicados por especialistas.</p>
          </div>
          <div className="servico-card">
            <img src="/imagens/cena-de-hospedag.png" alt="Hospedagem e Pet Sitting" />
            <h3>Hospedagem e Pet Sitting</h3>
            <p>Ambiente seguro e confortável para seu pet enquanto você viaja ou trabalha.</p>
          </div>
          <div className="servico-card">
            <img src="/imagens/cena-de-cursos.png" alt="Cursos e Treinamentos" />
            <h3>Cursos e Treinamentos</h3>
            <p>Capacitação para tutores e pets, com aulas práticas e teóricas.</p>
          </div>
        </div>
      </section>

      {/* Depoimentos (opcional) */}
      <section className="servicos-depoimentos">
        <h2>Depoimentos de Clientes</h2>
        <div className="depoimentos-carousel">
          <div className="depoimento-card">
            <img src="/imagens/ana.png" alt="Pet cliente" />
            <p>“A Pet Farma sempre cuida do meu cachorro com muito carinho. Recomendo!”</p>
            <span>- Ana, tutora do Max</span>
          </div>
          <div className="depoimento-card">
            <img src="/imagens/carlos.png" alt="Pet cliente" />
            <p>“Serviço excelente e equipe muito atenciosa. Meu gato adora!”</p>
            <span>- Carlos, tutor da Mel</span>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="servicos-diferenciais">
        <h2>Diferenciais Pet Farma</h2>
        <div className="diferenciais-grid">
          <div className="diferencial-item">
            <span className="diferencial-icon">💙</span>
            <p>Atendimento personalizado</p>
          </div>
          <div className="diferencial-item">
            <span className="diferencial-icon">🔒</span>
            <p>Ambiente seguro</p>
          </div>
          <div className="diferencial-item">
            <span className="diferencial-icon">👩‍⚕️</span>
            <p>Equipe qualificada</p>
          </div>
        </div>
      </section>
      {/* Chamada para ação */}
    </main>
  );
}
