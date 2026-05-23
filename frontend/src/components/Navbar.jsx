import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/productos', label: 'Productos' },
    { to: '/contacto', label: 'Contacto' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-name">Dulce Tentación</span>
        </Link>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
        <span /><span /><span />
      </button>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              className={pathname === to ? 'active' : ''}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
