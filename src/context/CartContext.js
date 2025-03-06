import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      // Ensure price is a number
      const normalizedProduct = { ...product, price: Number(product.price) };
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...normalizedProduct, quantity: 1 }];
    });
    toast.success(`${product.name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.info('Cart cleared!', {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);