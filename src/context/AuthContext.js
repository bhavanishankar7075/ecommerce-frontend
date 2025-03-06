import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (stored in localStorage)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  // Login function (simulated with localStorage)
  const login = (username, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = storedUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      setUser({ username });
      localStorage.setItem('user', JSON.stringify({ username }));
      return true;
    }
    return false;
  };

  // Signup function (simulated with localStorage)
  const signup = (username, password) => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (storedUsers.some((u) => u.username === username)) {
      return false; // Username already exists
    }
    const newUser = { username, password };
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    setUser({ username });
    localStorage.setItem('user', JSON.stringify({ username }));
    return true;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);