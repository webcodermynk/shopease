import { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const handleAuth = ({ token, user }) => {
    setToken(token);
    setUser(user);
    return user;
  };

  const value = {
    user,
    loading,
    login: async (email, password) => handleAuth(await api.login({ email, password })),
    signup: async (name, email, password) => handleAuth(await api.signup({ name, email, password })),
    logout: () => {
      setToken(null);
      setUser(null);
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
