'use client';
import { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const onToastRef = useRef(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('amberflow_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) setCart(parsed);
      }
      const savedPromo = localStorage.getItem('amberflow_promo');
      if (savedPromo) {
        const parsedPromo = JSON.parse(savedPromo);
        if (parsedPromo?.code) {
          setPromoCode(parsedPromo.code);
          setPromoDiscount(parsedPromo.discount || 0);
        }
      }
    } catch (e) {
      console.warn('Failed to load cart from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Persist cart to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('amberflow_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Persist promo to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      if (promoCode) {
        localStorage.setItem('amberflow_promo', JSON.stringify({ code: promoCode, discount: promoDiscount }));
      } else {
        localStorage.removeItem('amberflow_promo');
      }
    }
  }, [promoCode, promoDiscount, isLoaded]);

  // Set the toast callback — called by ToastProvider
  const setOnToast = useCallback((callback) => {
    onToastRef.current = callback;
  }, []);

  // Add item to cart or increment quantity
  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id || item._id === product._id
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity,
        };
        return newCart;
      }

      return [...prevCart, { ...product, quantity }];
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id && item._id !== id));
  }, []);

  // Update item quantity — remove if < 1
  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) {
      setCart((prevCart) => prevCart.filter((item) => item.id !== id && item._id !== id));
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id || item._id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCart([]);
    setPromoCode('');
    setPromoDiscount(0);
  }, []);

  // Apply promo code
  const applyPromo = useCallback((code) => {
    const trimmed = code.trim().toUpperCase();

    if (trimmed === 'NEW15') {
      setPromoCode(trimmed);
      setPromoDiscount(15);
      return { success: true, message: '🎉 Promo code NEW15 applied! 15% discount activated.' };
    }

    return { success: false, message: 'Invalid promo code. Please try again.' };
  }, []);

  // Remove promo code
  const removePromo = useCallback(() => {
    setPromoCode('');
    setPromoDiscount(0);
  }, []);

  // Computed values
  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  const discount = subtotal * promoDiscount / 100;
  const total = subtotal - discount;
  const count = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    promoCode,
    promoDiscount,
    applyPromo,
    removePromo,
    subtotal,
    discount,
    total,
    count,
    isLoaded,
    setOnToast,
    onToastRef,
    // Legacy support
    getCartCount: () => count,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
