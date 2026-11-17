import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice } from '../api';

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.orders().then(setOrders).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="container"><div className="alert error">{error}</div></div>;
  if (!orders) return <div className="center-note">Loading…</div>;

  if (!orders.length) {
    return (
      <div className="container empty">
        <div className="empty-emoji">📦</div>
        <h2>No orders yet</h2>
        <p>Once you place an order it will show up here.</p>
        <Link to="/" className="btn btn-primary">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="container orders">
      <h1>Your orders</h1>
      {orders.map((o) => (
        <article className="card order" key={o.id}>
          <header>
            <div>
              <strong>Order #{o.id}</strong>
              <span className="muted"> · {new Date(o.createdAt).toLocaleString('en-IN')}</span>
            </div>
            <span className="status">{o.status}</span>
          </header>
          <ul>
            {o.items.map((i) => (
              <li key={i.productId}>
                <span>{i.emoji} {i.name} × {i.qty}</span>
                <span>{formatPrice(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <footer>
            <span className="muted">Ship to: {o.address}</span>
            <strong>Total {formatPrice(o.total)}</strong>
          </footer>
        </article>
      ))}
    </div>
  );
}
