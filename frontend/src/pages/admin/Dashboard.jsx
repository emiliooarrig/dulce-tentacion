import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Inicio', icon: '🏠', end: true },
  { to: '/admin/productos', label: 'Productos', icon: '🎂' },
  { to: '/admin/categorias', label: 'Categorías', icon: '🏷️' },
  { to: '/admin/usuarios', label: 'Usuarios', icon: '👤' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  function handleLogout() {
    logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span>Admin Panel</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, icon, end }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar-link ${(end ? pathname === to : pathname.startsWith(to)) ? 'active' : ''}`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <span className="user-avatar">👤</span>
            <div>
              <p className="user-name">{user?.nombre}</p>
              <p className="user-role">{user?.rol}</p>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
