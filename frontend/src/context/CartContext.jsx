import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const saved = localStorage.getItem('shippingAddress');
    return saved
      ? JSON.parse(saved)
      : {
          address: '104 Innovation Way',
          city: 'San Francisco',
          postalCode: '94105',
          country: 'United States'
        };
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    return localStorage.getItem('paymentMethod') || 'Stripe';
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  useEffect(() => {
    localStorage.setItem('paymentMethod', paymentMethod);
  }, [paymentMethod]);

  const addToCart = (product, qty = 1) => {
    const quantity = Number(qty);
    setCartItems(prev => {
      const exist = prev.find(x => x.product === product._id);
      if (exist) {
        return prev.map(x =>
          x.product === product._id
            ? { ...x, quantity: Math.min(x.quantity + quantity, product.stock || 99) }
            : x
        );
      } else {
        return [
          ...prev,
          {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            stock: product.stock,
            category: product.category,
            quantity
          }
        ];
      }
    });
  };

  const addBundleToCart = (products) => {
    products.forEach(p => addToCart(p, 1));
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(x => x.product !== productId));
  };

  const updateQuantity = (productId, qty) => {
    const quantity = Number(qty);
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(x => (x.product === productId ? { ...x, quantity } : x))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const saveShippingAddress = (address) => {
    setShippingAddress(address);
  };

  const savePaymentMethod = (method) => {
    setPaymentMethod(method);
  };

  // Metrics
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsPrice = parseFloat(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  );
  const shippingPrice = itemsPrice > 150 || itemsPrice === 0 ? 0.0 : 15.0;
  const taxPrice = parseFloat((itemsPrice * 0.08).toFixed(2));
  const totalPrice = parseFloat((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        shippingAddress,
        paymentMethod,
        totalItemsCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addToCart,
        addBundleToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        saveShippingAddress,
        savePaymentMethod
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
