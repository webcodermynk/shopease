import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const EMPTY = { items: [], total: 0, count: 0 };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(EMPTY);

  const refresh = useCallback(async () => {
    try {
      setCart(await api.cart());
    } catch {
      setCart(EMPTY);
    }
  }, []);

  useEffect(() => {
    if (user) refresh();
    else setCart(EMPTY);
  }, [user, refresh]);

  const value = {
    cart,
    refresh,
    add: async (productId, qty = 1) => setCart(await api.addToCart(productId, qty)),
    setQty: async (productId, qty) => setCart(await api.setQty(productId, qty)),
    remove: async (productId) => setCart(await api.removeFromCart(productId))
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
