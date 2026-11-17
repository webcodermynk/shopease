import { Link, useLocation, useNavigate } from 'react-router-dom';
import { formatPrice } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export function ProductArt({ product, size = 'md' }) {
  return (
    <div
      className={`product-art ${size}`}
      style={{ background: `linear-gradient(135deg, ${product.color}33, ${product.color}88)` }}
    >
      <span>{product.emoji}</span>
    </div>
  );
}

export function useAddToCart() {
  const { user } = useAuth();
  const { add } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  return async (product, qty = 1) => {
    if (!user) {
      toast('Log in to add items to your cart', 'info');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    try {
      await add(product.id, qty);
      toast(`${product.name} added to cart`);
    } catch (err) {
      toast(err.message, 'error');
    }
  };
}

export default function ProductCard({ product }) {
  const addToCart = useAddToCart();

  return (
    <article className="card product-card">
      <Link to={`/product/${product.id}`} aria-label={product.name}>
        <ProductArt product={product} />
      </Link>
      <div className="card-body">
        <span className="chip-small">{product.category}</span>
        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <div className="rating">★ {product.rating.toFixed(1)}</div>
        <div className="card-foot">
          <strong className="price">{formatPrice(product.price)}</strong>
          <button className="btn btn-primary btn-sm" onClick={() => addToCart(product)}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
