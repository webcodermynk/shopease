import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">🛍️</span> ShopEase
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end>Shop</NavLink>
          {user && <NavLink to="/orders">Orders</NavLink>}
          <NavLink to="/cart" className="cart-link">
            Cart
            {cart.count > 0 && <span className="badge">{cart.count}</span>}
          </NavLink>
        </nav>

        <div className="nav-auth">
          {user ? (
            <>
              <span className="hello">Hi, {user.name.split(' ')[0]}</span>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="btn btn-ghost" to="/login">Log in</Link>
              <Link className="btn btn-primary" to="/signup">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
