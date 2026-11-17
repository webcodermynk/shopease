import { Route, Routes, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route
            path="*"
            element={
              <div className="container empty">
                <div className="empty-emoji">🧭</div>
                <h2>Page not found</h2>
                <Link to="/" className="btn btn-primary">Back to shop</Link>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="footer">
        <div className="container">ShopEase · built with React, Node.js &amp; Express</div>
      </footer>
    </>
  );
}
