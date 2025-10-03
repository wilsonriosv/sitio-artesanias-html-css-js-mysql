export default function AboutSection() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>Nuestra Historia</h2>
            <p>
              En Artesanías Bella Vista, cada pieza cuenta una historia. Somos un equipo de artesanos apasionados que
              creamos productos únicos con amor y dedicación.
            </p>
            <p>
              Desde hace más de 10 años, hemos estado creando piezas especiales que reflejan la belleza de la artesanía
              tradicional con un toque moderno.
            </p>
            <div className="features">
              <div className="feature">
                <i className="fas fa-hand-holding-heart" aria-hidden="true" />
                <span>Hecho a mano</span>
              </div>
              <div className="feature">
                <i className="fas fa-gem" aria-hidden="true" />
                <span>Calidad Premium</span>
              </div>
              <div className="feature">
                <i className="fas fa-leaf" aria-hidden="true" />
                <span>Materiales Sostenibles</span>
              </div>
            </div>
          </div>
          <div className="about-images">
            <div className="image-collage">
              <div className="collage-item item-1" />
              <div className="collage-item item-2" />
              <div className="collage-item item-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



