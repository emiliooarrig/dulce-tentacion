import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = selectedCategory ? { categoria_id: selectedCategory } : {};
    api.get('/products', { params })
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="page-products">
      <div className="page-header">
        <h1>Nuestros Productos</h1>
        <p>Descubre nuestra variedad de creaciones artesanales</p>
      </div>

      {/* Filtros por categoría */}
      <div className="filter-bar">
        <button
          className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('')}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`filter-btn ${selectedCategory === String(cat.id) ? 'active' : ''}`}
            onClick={() => setSelectedCategory(String(cat.id))}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-grid">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : products.length > 0 ? (
        <div className="products-grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="empty-state">
          <span>🍰</span>
          <p>No hay productos en esta categoría por el momento.</p>
        </div>
      )}
    </div>
  );
}
