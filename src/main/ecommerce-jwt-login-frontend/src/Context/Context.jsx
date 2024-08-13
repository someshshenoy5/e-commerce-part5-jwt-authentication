import axios from "../axios"; 
import { useState, useEffect, createContext } from "react";

const AppContext = createContext({
  
  isError: "",
  cart: [],
  addToCart: (product) => {},
  removeFromCart: (productId) => {},
 
  updateStockQuantity: (productId, newQuantity) => {},
  token: ""
});

export const AppProvider = ({ children }) => {
  const [isError, setIsError] = useState("");
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex((item) => item.id === product.id);
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
  };

  const removeFromCart = (productId) => {
    console.log("productID", productId);
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    console.log("CART", cart);
  };


  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  return (
    <AppContext.Provider value={{ isError, cart, addToCart, removeFromCart, clearCart, token }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
