import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, formatPrice } from '../api';
import { ProductArt } from '../components/ProductCard';
import { useToast } from '../components/Toast';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, setQty, remove, refresh } = useCart();
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const guard = async (fn) => {
    try {
      await fn();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const checkout = async (e) => {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      await api.placeOrder(address);
      await refresh();
      toast('Order placed! 🎉');
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  if (!cart.items.length) {
    return (
      <div className="container empty">
        <div className="empty-emoji">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn btn-primary">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container cart-layout">
      <section>
        <h1>Your cart</h1>
        <div className="cart-list">
          {cart.items.map(({ product, qty, subtotal }) => (
            <div className="cart-row card" key={product.id}>
              <ProductArt product={product} size="sm" />
              <div className="cart-info">
                <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
                <span className="muted">{formatPrice(product.price)} each</span>
                <button className="link-btn" onClick={() => guard(() => remove(product.id))}>Remove</button>
              </div>
              <div className="qty">
                <button onClick={() => guard(() => setQty(product.id, qty - 1))} aria-label="Decrease">−</button>
                <span>{qty}</span>
                <button onClick={() => guard(() => setQty(product.id, qty + 1))} aria-label="Increase">+</button>
              </div>
              <strong className="subtotal">{formatPrice(subtotal)}</strong>
            </div>
          ))}
        </div>
      </section>

      <aside className="card summary">
        <h2>Order summary</h2>
        <div className="sum-row"><span>Items ({cart.count})</span><span>{formatPrice(cart.total)}</span></div>
        <div className="sum-row"><span>Delivery</span><span className="free">Free</span></div>
        <div className="sum-row total"><span>Total</span><span>{formatPrice(cart.total)}</span></div>

        <form onSubmit={checkout}>
          <label className="label" htmlFor="address">Delivery address</label>
          <textarea
            id="address"
            className="input"
            rows="3"
            placeholder="House no, street, city, PIN"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          {error && <div className="alert error">{error}</div>}
          <button className="btn btn-primary btn-lg block" disabled={placing}>
            {placing ? 'Placing order…' : 'Place order'}
          </button>
        </form>
      </aside>
    </div>
  );
}
