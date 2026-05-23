export default function ProductCard({ product }) {
  const imageUrl = product.imagen || null;

  return (
    <div className="product-card">
      <div className="product-image">
        {imageUrl ? (
          <img src={imageUrl} alt={product.nombre} loading="lazy" />
        ) : (
          <div className="product-image-placeholder">🎂</div>
        )}
        {product.destacado && <span className="badge-featured">Destacado</span>}
      </div>
      <div className="product-info">
        {product.categoria_nombre && (
          <span className="product-category">{product.categoria_nombre}</span>
        )}
        <h3 className="product-name">{product.nombre}</h3>
        {product.descripcion && (
          <p className="product-description">{product.descripcion}</p>
        )}
        <p className="product-price">${parseFloat(product.precio).toFixed(2)}</p>
      </div>
    </div>
  );
}
