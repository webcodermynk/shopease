import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { ProductArt, useAddToCart } from '../components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const addToCart = useAddToCart();

  useEffect(() => {
    setProduct(null);
    api.product(id).then(setProduct).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="container"><div className="alert error">{error}</div></div>;
  if (!product) return <div className="center-note">Loading…</div>;

  return (
    <div className="container detail">
      <Link to="/" className="back">← Back to shop</Link>
      <div className="detail-grid">
        <ProductArt product={product} size="lg" />
        <div>
          <span className="chip-small">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="rating">★ {product.rating.toFixed(1)} · {product.stock} in stock</div>
          <p className="desc">{product.description}</p>
          <div className="detail-price">{formatPrice(product.price)}</div>

          <div className="qty-row">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase">+</button>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => addToCart(product, qty)}>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
