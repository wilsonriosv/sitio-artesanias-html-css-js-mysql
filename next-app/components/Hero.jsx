"use client";

export default function Hero({ onExplore }) {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1 className="hero-title">Artesanías Únicas para Tu Estilo</h1>
        <p className="hero-subtitle">
          Descubre nuestra colección exclusiva de joyería y accesorios hechos a mano
        </p>
        <button className="cta-button" type="button" onClick={onExplore}>
          Explorar Colección
        </button>
      </div>
      <div className="hero-image">
        <div className="floating-elements">
          <div className="floating-item item-1">
            <i className="fas fa-ring" aria-hidden="true" />
          </div>
          <div className="floating-item item-2">
            <i className="fas fa-gem" aria-hidden="true" />
          </div>
          <div className="floating-item item-3">
            <i className="fas fa-crown" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}



