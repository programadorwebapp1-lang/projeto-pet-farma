import React from "react";

export default function FooterAlt() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-col">
          <h4>Quem somos</h4>
          <ul>
            <li>Nosso time</li>
            <li>Nossas unidades</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Especialidades</h4>
          <ul>
            <li>Medicina Felina</li>
            <li>Dermatologia</li>
            <li>Oftalmologia</li>
            <li>Odontologia</li>
            <li>Ortopedia</li>
            <li>Cirurgia</li>
            <li>Acupuntura</li>
            <li>Veja todos</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Remédios</h4>
          <ul>
            <li>NexGard Spectra</li>
            <li>Antibióticos</li>
            <li>Meloxicam</li>
            <li>Simparic</li>
            <li>Otomax</li>
            <li>BioDex</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Serviços</h4>
          <ul>
            <li>Banho/tosa</li>
            <li>Castração</li>
            <li>Medicamentos</li>
            <li>Vacinação</li>
            <li>Atendimento Emergencial</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Blogs</h4>
          <ul>
            <li>Cães</li>
            <li>Gatos</li>
            <li>Aquáticos</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span className="logo">
          <img src="https://img.icons8.com/ios-filled/24/ffffff/pet-commands-train.png" style={{verticalAlign:'middle',marginRight:6}} />PETFARMA
        </span>
        <div className="redes">
          <span>Redes Sociais</span>
          <a href="#" style={{margin:"0 4px"}}><img src="https://img.icons8.com/ios-filled/24/ffffff/instagram-new.png" /></a>
          <a href="#" style={{margin:"0 4px"}}><img src="https://img.icons8.com/ios-filled/24/ffffff/whatsapp.png" /></a>
        </div>
      </div>
    </footer>
  );
}
