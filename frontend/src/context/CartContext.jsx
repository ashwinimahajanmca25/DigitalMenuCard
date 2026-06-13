// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Get user ID from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || "guest";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`cart-${userId}`)) || [];
    setCartItems(saved);
  }, [userId]);

  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem(`cart-${userId}`, JSON.stringify(items));
  };

  // src/context/CartContext.js (or inside a handler in MenuCard.jsx)
// CartContext.jsx
const addToCart = async (item) => {
  const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");
const userId = user?.id;


  if (!userId) return alert("Please login to add items");

  const cartData = {
    userId,
    productId: item._id || item.id, // ✅ Add this line

    name: item.name,
    price: item.price,
    quantity: 1,
  };

  console.log("📦 Sending to backend:", cartData);

  try {
    await axios.post("http://localhost:5000/api/cart/add", cartData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Item added to DB cart");
  } catch (err) {
    console.error("❌ Error saving to DB", err);
  }
};




  const updateQuantity = (id, qty) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, qty) } : item
    );
    saveCart(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalPrice,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
