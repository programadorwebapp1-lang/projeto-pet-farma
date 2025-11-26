import React from "react";

export default function BannerAlt() {
  return (
    <section className="banner">
      <div className="banner-content">
        <div className="banner-text">
          <span className="banner-melhor">MELHOR</span><br />
          <span className="banner-qualidade">QUALIDADE</span><br />
          <span className="banner-pet">PARA O SEU PET</span>
        </div>
        <img src="https://img.icons8.com/fluency/96/000000/vaccine-bottle.png" alt="Frasco" className="bottle" />
        <div className="banner-pets">
          <img src="https://img.icons8.com/fluency/144/000000/dog.png" alt="Cachorro" className="dog" />
          <img src="https://img.icons8.com/fluency/96/000000/cat.png" alt="Gato" className="cat" />
        </div>
      </div>
    </section>
  );
}
