import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ products: 0, categories: 0, users: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/products/all'),
      api.get('/categories'),
      api.get('/users'),
    ]).then(([p, c, u]) => {
      setStats({ products: p.data.length, categories: c.data.length, users: u.data.length });
    }).catch(console.error);
  }, []);

  return (
    <div className="admin-home">
      <div className="admin-page-header">
        <h1>Bienvenido, {user?.nombre}</h1>
        <p>Panel de administración de Dulce Tentación</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">🎂</span>
          <div>
            <p className="stat-value">{stats.products}</p>
            <p className="stat-label">Productos</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🏷️</span>
          <div>
            <p className="stat-value">{stats.categories}</p>
            <p className="stat-label">Categorías</p>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-icon">👤</span>
          <div>
            <p className="stat-value">{stats.users}</p>
            <p className="stat-label">Usuarios</p>
          </div>
        </div>
      </div>
    </div>
  );
}
