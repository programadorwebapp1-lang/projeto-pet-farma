
import React, { useRef, useState } from "react";
import "./LayoutDefault.css";
import api from '../../service/api';

export default function LayoutDefault({ children }: { children: React.ReactNode }) {
  // Estados para carrossel de categorias
  const [currentIndex, setCurrentIndex] = useState(0);
  const categoriaCardsRef = useRef<HTMLDivElement>(null);
  const dotsCount = 4;

  // Estados para carrossel de outras categorias
  const [outrasIndex, setOutrasIndex] = useState(0);
  const outrasCardsCount = 4;

  // Estado para destaque veterinário
  const [mostrandoMais, setMostrandoMais] = useState(false);
  const textoOriginal = `
    <h3>Produtos testados e aprovados por especialistas</h3>
    <p>Produtos com selo de verificação do Serviço de Inspeção Federal (SIF) do Ministério da Agricultura, Pecuária e Abastecimento (Mapa), visando garantir qualidade e segurança alimentar. Já para testar a ausência de crueldade contra animais em produtos (cosméticos, etc.), o foco é na proibição de testes em animais</p>
  `;
  const textoExtra = `<h3>Sobre o Selo de Qualidade</h3><p>O Selo SIF garante que os produtos passaram por rigorosa inspeção. Produtos cruelty-free não são testados em animais. Confie na Petfarma!</p>`;

  // Estado para pesquisa
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResultsRemedios, setSearchResultsRemedios] = useState<any[]>([]);
  const [searchResultsBrinquedos, setSearchResultsBrinquedos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);


  // Handler de pesquisa
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 1) {
      setLoading(true);
      try {
        const [remediosResp, brinquedosResp] = await Promise.all([
          api.get('/remedios/?busca=' + encodeURIComponent(term)),
          api.get('/brinquedos/?busca=' + encodeURIComponent(term)),
        ]);
        const remediosApi = remediosResp.data.data.map((item: any) => ({
          id: item.ID,
          nome: item.NOME,
          foto: item.FOTO || '',
        }));
        setSearchResultsRemedios(remediosApi);
        const brinquedosApi = brinquedosResp.data.data.map((item: any) => ({
          id: item.ID,
          nome: item.NOME,
          imagem: item.IMAGEM || '',
        }));
        setSearchResultsBrinquedos(brinquedosApi);
      } catch (error) {
        setSearchResultsRemedios([]);
        setSearchResultsBrinquedos([]);
      }
      setLoading(false);
    } else {
      setSearchResultsRemedios([]);
      setSearchResultsBrinquedos([]);
    }
  };
  // Handler do carrinho
  const handleCartClick = () => {
    alert('Você clicou no carrinho! (Aqui pode abrir um modal ou redirecionar para a página do carrinho)');
  };

  // Handler do destaque veterinário
  const handleDestaqueClick = () => {
    setMostrandoMais((prev) => !prev);
  };

  // Renderização dos cards de categoria
  const renderCategoriaCards = () => {
    const cards = [
      { src: "/imagens/cuidados-filhote-de-cachorro.jpg", alt: "Cachorro", label: <a href="/cachorro">Cachorro</a> },
      { src: "/imagens/cuidados-filhote-de-gato.jpg", alt: "Gato", label: <a href="/gatos">Gato</a> },
      { src: "/imagens/cuidados-outros-pets.jpg", alt: "Outros pets", label: <a href="/gatos">Outros Pets</a> },
      { src: "/imagens/ícone de medicamento.jpg", alt: "Remédios", label: <a href="/remedios">Remédios</a> },
    ];
    return cards.map((card, idx) => (
      <div
        className="categoria-card"
        key={idx}
        style={{ display: idx === currentIndex ? 'flex' : 'none' }}
      >
        <img src={card.src} alt={card.alt} />
        <span>{card.label}</span>
      </div>
    ));
  };

  // Renderização dos cards de outras categorias
  const renderOutrasCards = () => {
    const cards = [
      {
        src: "/imagens/servicos.png",
        alt: "Serviços",
        label: "Serviços",
        link: "/servicos"
      },
      {
        src: "/imagens/promocao.png",
        alt: "Promoção",
        label: "Promoção",
        link: "/promocao"
      },
      {
        src: "/imagens/brinquedos.png",
        alt: "Brinquedos",
        label: "Brinquedos",
        link: "/brinquedos"
      },
      {
        src: "/imagens/urso-pelucia.png",
        alt: "Urso",
        label: "Urso",
        link: "/urso"
      },
    ];
    return cards.map((card, idx) => (
    <div
      className="outra-categoria-card"
      key={idx}
      style={{ display: idx === outrasIndex ? 'flex' : 'none' }}
    >
      {card.link ? (
          <a href={card.link} className="outra-categoria-link">
            {card.src && <img src={card.src} alt={card.alt} />}
            <span className="outra-categoria-nome">{card.label}</span>
          </a>
        ) : (
          <>
            {card.src && <img src={card.src} alt={card.alt} />}
            <span className="outra-categoria-nome">{card.label}</span>
          </>
        )}
      </div>
    ));
  };

  // Renderização dos dots
  const renderDots = (activeIdx: number, count: number, className: string) => {
    return Array.from({ length: count }).map((_, idx) => (
      <span
        key={idx}
        className={className + (idx === activeIdx ? ' active' : '')}
      ></span>
    ));
  };

  // Renderização do texto do destaque veterinário
  const renderDestaqueTexto = () => {
    if (mostrandoMais) {
      return <div className="destaque-vet-texto" dangerouslySetInnerHTML={{ __html: textoOriginal + textoExtra }} />;
    }
    return <div className="destaque-vet-texto" dangerouslySetInnerHTML={{ __html: textoOriginal }} />;
  };

  return (
    <>
      {/* Cabeçalho principal */}
      <header className="header-relative">
        <div className="search-area">
          <label htmlFor="search">
            <div className="search-wrapper">
              <input
                type="text"
                id="search"
                name="search"
                className="search-input"
                placeholder="Pesquisar produtos"
                value={searchTerm}
                onChange={handleSearchChange}
                autoComplete="off"
              />
              <button type="button" className="search-btn"><i className='bx bx-search'></i></button>
              {/* Dropdown de sugestões */}
              {(searchResultsRemedios.length > 0 || searchResultsBrinquedos.length > 0) && (
                <div className="search-dropdown">
                  <ul className="search-dropdown-list">
                    {/* Remédios */}
                    {searchResultsRemedios.map((item) => (
                      <li key={"remedio-"+item.id} className="search-dropdown-item">
                        <i className='bx bx-search search-dropdown-icon'></i>
                        {item.foto && (
                          <img src={item.foto} alt={item.nome} className="search-dropdown-img" />
                        )}
                        <a href={`/remedios/${item.id}`} className="search-dropdown-link">{item.nome}</a>
                      </li>
                    ))}
                    {/* Brinquedos */}
                    {searchResultsBrinquedos.map((item) => (
                      <li key={"brinquedo-"+item.id} className="search-dropdown-item">
                        <i className='bx bx-search search-dropdown-icon'></i>
                        {item.imagem && (
                          <img src={item.imagem} alt={item.nome} className="search-dropdown-img" />
                        )}
                        <a href={`/brinquedos/${item.id}`} className="search-dropdown-link">{item.nome}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </label>
        </div>
        <div className="logo-container">
          <img src="/imagens/logo petfarma.png" alt="logo petfarma" className="logo" />
        </div>
        <div id="cart-icon" onClick={handleCartClick} className="cart-icon">
          <i className='bx bx-cart-alt'></i>
        </div>
        <div id="user">
          <i className='bx bxs-user'></i>
          <a href="login" className="login-link">Entrar </a>
          <a href="login" className="cadastro-link">Cadastre-se</a>
        </div>
      </header>
  <br /><br /><br /><br /><br /><br /><br />
      {/* Terceira seção de produtos */}
      <section className="tertiary-header">
        <div className="container-imagens">
          <img src="/imagens/4.png" alt="pet" />
          <img src="/imagens/1.png" alt="pet" />
          <img src="/imagens/3.png" alt="pet" />
          <img src="/imagens/2.png" alt="pet" />
        </div>
      </section>
      <br /><br /><br /><br />
      <section className="quaternary-header">
        <p>Cuidados essenciais</p>
        <div className="container-2imagens">
          <img src="/imagens/cuidados.png" alt="pet" />
        </div>
      </section>
      {/* Divisória e carrossel de categorias */}
      <div className="categoria-divisoria">
        <div className="categoria-divisoria-bar"></div>
        <div className="categoria-divisoria-icone"><i className='bx bx-chevron-down'></i></div>
        <div className="categoria-divisoria-bar"></div>
      </div>
      <section className="compre-categoria">
        <h2>Compre por categoria</h2>
        <div className="categoria-carousel">
          <button
            className="carousel-btn prev"
            aria-label="Anterior"
            onClick={() => setCurrentIndex((currentIndex - 1 + dotsCount) % dotsCount)}
          >&#8592;</button>
          <div className="categoria-cards" ref={categoriaCardsRef}>
            {renderCategoriaCards()}
          </div>
          <button
            className="carousel-btn next"
            aria-label="Próximo"
            onClick={() => setCurrentIndex((currentIndex + 1) % dotsCount)}
          >&#8594;</button>
        </div>
        <div className="carousel-indicators">
          {renderDots(currentIndex, dotsCount, 'dot')}
        </div>
      </section>
      <br /><br /><br /><br />
      {/* Destaque Médico-Veterinário */}
      <section className="destaque-vet">
        <img src="/imagens/veterinaria-destaque.png" alt="Veterinária" className="destaque-vet-img" />
        {renderDestaqueTexto()}
        <button
          className="destaque-vet-btn"
          aria-label={mostrandoMais ? 'Fechar informações' : 'Mostrar mais informações'}
          onClick={handleDestaqueClick}
        >&#60;</button>
      </section>
      {/* Outras Categorias */}
      <section className="outras-categorias">
        <h2>Outras categorias</h2>
        <div className="outras-categorias-carousel">
          <button
            className="outras-carousel-btn prev"
            aria-label="Anterior"
            onClick={() => setOutrasIndex((outrasIndex - 1 + outrasCardsCount) % outrasCardsCount)}
          >&#8592;</button>
          <div className="outras-categorias-cards">
            {renderOutrasCards()}
          </div>
          <button
            className="outras-carousel-btn next"
            aria-label="Próximo"
            onClick={() => setOutrasIndex((outrasIndex + 1) % outrasCardsCount)}
          >&#8594;</button>
        </div>
        <div className="outras-carousel-indicators">
          {renderDots(outrasIndex, outrasCardsCount, 'outras-dot')}
        </div>
      </section>
      {/* Benefícios */}
      <section className="info-beneficios">
        <div className="beneficio">
          <i className='bx bx-time'></i>
          <span className="text">Receba em horas</span>
        </div>
        <div className="beneficio">
          <i className='bx bx-credit-card-alt'></i>
          <span className="text">Até 3x sem juros</span>
        </div>
        <div className="beneficio">
          <i className='bx bx-store'></i>
          <span className="text">Retire e troque na loja</span>
        </div>
      </section>
      {/* Institucional / Sobre */}
      <div className="institucional-divisoria">
        <div className="institucional-divisoria-bar"></div>
        <div className="institucional-divisoria-icone"><i className='bx bx-chevron-down'></i></div>
        <div className="institucional-divisoria-bar"></div>
      </div> <br />
      <section className="institucional"> 
        <img src="/imagens/logo petfarma.png" alt="Logo Petfarma" className="institucional-logo" />
        <p className="institucional-texto">
          Só quem é apaixonado por animais sabe: a relação de amor e cumplicidade que temos com nossos bichinhos de estimação é um vínculo único! Por essa razão, não medimos esforços para oferecer o que há de melhor para trazer ainda mais alegria e qualidade de vida. Rações, acessórios, medicamentos e brinquedos estão na nossa listinha de prioridades; e tudo isso você encontra em nosso Petfarma online.
        </p>
      </section>
      {children}
    </>
  );
}
