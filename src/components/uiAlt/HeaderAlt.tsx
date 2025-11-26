import React from "react";

export default function HeaderAlt() {
  return (
    <header>
      <div className="top-bar">
        <span className="logo">
          <img src="https://img.icons8.com/ios-filled/24/ffffff/pet-commands-train.png" style={{verticalAlign:'middle',marginRight:6}} />
          PETFARMA
        </span>
        <div className="user-actions">
          <span>
            <img src="https://img.icons8.com/ios-filled/20/ffffff/user.png" style={{verticalAlign:'middle'}} /> login/entrar
          </span>
        </div>
      </div>
      <nav>
  <ul>
          <li>☰ Categorias</li>
          <li>Alimentos</li>
          <li>Remédios</li>
          <li>Lojas para retirada</li>
          <li>Ajuda</li>
          <li>Serviços</li>
        </ul>
        <div className="search-cart">
          <input type="text" placeholder="Buscar" />
          <button>
            <img src="https://img.icons8.com/ios-filled/18/ff944d/search--v1.png" style={{verticalAlign:'middle'}} />
          </button>
          <span className="cart">
            <img src="https://img.icons8.com/ios-filled/24/ff944d/shopping-cart.png" style={{verticalAlign:'middle'}} />
          </span>
        </div>
      </nav>
    </header>
  );
}
