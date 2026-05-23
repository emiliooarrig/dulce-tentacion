import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import aboutImg from '../assets/cupcake-zanahoria.jpeg';
import fondoInicio from '../assets/fondo-inicio.jpg';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/featured')
      .then((res) => setFeatured(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-home">
      {/* Hero */}
      <section className="hero" style={{ backgroundImage: `url(${fondoInicio})` }}>
        <div className="hero-content">
          <h1 className="hero-title">Dulce Tentación</h1>
          <p className="hero-subtitle">Pastelería Artesanal</p>
          <p className="hero-description">
            Elaboramos cada pieza con amor y los mejores ingredientes para hacer de cada ocasión un momento memorable.
          </p>
          <Link to="/productos" className="btn btn-primary btn-lg">
            Ver Productos
          </Link>
        </div>
      </section>

      {/* Quiénes somos */}
      <section className="about-section">
        <div className="about-image">
          <img src={aboutImg} alt="Dulce Tentación pastelería" />
        </div>
        <div className="about-content">
          <span className="about-tag">Quiénes somos</span>
          <h2 className="about-title">Una historia hecha de azúcar y dedicación</h2>
          <p>
            Dulce Tentación nació de la pasión por la repostería artesanal y el deseo de compartir
            momentos especiales a través de cada creación. Desde nuestros inicios, nos hemos dedicado
            a elaborar pasteles, cupcakes y postres con ingredientes frescos y naturales, sin
            conservadores artificiales.
          </p>
          <p>
            Cada pieza que sale de nuestra cocina lleva consigo horas de trabajo, dedicación y el
            compromiso de ofrecerte siempre la más alta calidad. Creemos que un buen postre tiene el
            poder de transformar cualquier celebración en un recuerdo inolvidable.
          </p>
          <Link to="/contacto" className="btn btn-outline">
            Contáctanos
          </Link>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="section featured-section">
        <div className="section-header">
          <h2>Productos Destacados</h2>
          <p>Una selección de nuestras creaciones más especiales</p>
        </div>

        {loading ? (
          <div className="loading-grid">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : featured.length > 0 ? (
          <div className="products-grid">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="empty-message">Próximamente productos disponibles.</p>
        )}

        <div className="section-cta">
          <Link to="/productos" className="btn btn-outline">Ver todos los productos</Link>
        </div>
      </section>

      {/* Valores */}
      <section className="section values-section">
        <div className="section-header">
          <h2>Por qué elegirnos</h2>
          <p>Cada detalle importa cuando se trata de endulzar tu momento</p>
        </div>
        <div className="values-grid">
          <div className="value-card">
            <span className="value-icon">🌿</span>
            <h3>Ingredientes Naturales</h3>
            <p>Usamos solo ingredientes de la más alta calidad sin conservadores artificiales.</p>
          </div>
          <div className="value-card">
            <span className="value-icon">💝</span>
            <h3>Hecho con Amor</h3>
            <p>Cada pieza es elaborada a mano con dedicación y pasión por la repostería.</p>
          </div>
          <div className="value-card">
            <span className="value-icon">🎨</span>
            <h3>Diseños Únicos</h3>
            <p>Creamos diseños personalizados para hacer de tu evento algo especial.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
