import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="brand-name">Dulce Tentación</span>
          <p>Pastelería Artesanal</p>
        </div>
        <div className="footer-links">
          <h4>Navegación</h4>
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/contacto">Contacto</Link>
        </div>
        <div className="footer-links">
          <h4>Administración</h4>
          <Link to="/admin/login">Acceso Admin</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Dulce Tentación. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
