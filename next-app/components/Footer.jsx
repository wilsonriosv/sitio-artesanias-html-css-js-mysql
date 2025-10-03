export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Artesanías Bella Vista</h3>
            <p>Creando arte con amor desde 2014</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook" aria-hidden="true" />
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram" aria-hidden="true" />
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter" aria-hidden="true" />
              </a>
              <a href="#" aria-label="Pinterest">
                <i className="fab fa-pinterest" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li>
                <a href="#products">Productos</a>
              </li>
              <li>
                <a href="#about">Nosotros</a>
              </li>
              <li>
                <a href="#contact">Contacto</a>
              </li>
              <li>
                <a href="#">Política de Privacidad</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Categorías</h4>
            <ul>
              <li>
                <a href="#">Joyería</a>
              </li>
              <li>
                <a href="#">Relojes</a>
              </li>
              <li>
                <a href="#">Accesorios</a>
              </li>
              <li>
                <a href="#">Ropa</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contacto</h4>
            <p>
              <i className="fas fa-phone" aria-hidden="true" /> +1 234 567 890
            </p>
            <p>
              <i className="fas fa-envelope" aria-hidden="true" /> info@artesaniasbellavista.com
            </p>
            <p>
              <i className="fas fa-map-marker-alt" aria-hidden="true" /> Calle Principal #123
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 <a href="https://mipymetic.com" target="_blank" rel="noopener noreferrer"><span className="footer-highlight">MiPyMeTIC S.A.S.</span></a> Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}



