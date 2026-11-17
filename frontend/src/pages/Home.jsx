import { useEffect, useState } from 'react';
import { api } from '../api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.categories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .products({ q, category, sort })
        .then((list) => {
          setProducts(list);
          setError('');
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timer);
  }, [q, category, sort]);

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <h1>Everyday things, <span className="accent">beautifully simple.</span></h1>
            <p>Browse the collection, build your cart and check out in a couple of clicks.</p>
          </div>
          <div className="hero-emoji" aria-hidden="true">🛒✨</div>
        </div>
      </section>

      <section className="container">
        <div className="toolbar">
          <input
            className="input search"
            placeholder="Search products…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        <div className="chips">
          {['', ...categories].map((c) => (
            <button
              key={c || 'all'}
              className={`chip ${category === c ? 'active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c || 'All'}
            </button>
          ))}
        </div>

        {error && <div className="alert error">{error}</div>}
        {loading && !products.length && <div className="center-note">Loading products…</div>}
        {!loading && !error && !products.length && (
          <div className="center-note">No products match your search.</div>
        )}

        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
