"use client";

export default function Hero({ onExplore }) {
  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1 className="hero-title">Artesanias Unicas para Tu Estilo</h1>
        <p className="hero-subtitle">
          Descubre nuestra coleccion exclusiva de joyeria y accesorios hechos a mano
        </p>
        <button className="cta-button" type="button" onClick={onExplore}>
          Explorar Coleccion
        </button>
      </div>
      <div className="hero-image">
        <img
          src="/images/placeholders/Artesanias-LeidyLuana1.jpg"
          alt="Artesanias Leidy Luana"
          className="hero-photo"
        />
      </div>
    </section>
  );
}
