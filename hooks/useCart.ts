"use client";

import { useState, useEffect } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  sellerId: string;
  sellerName: string;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("kreasi_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart storage:", e);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("kreasi_cart", JSON.stringify(newCart));
  };

  const addToCart = (item: CartItem) => {
    const exists = cart.some((i) => i.id === item.id);
    if (!exists) {
      const newCart = [...cart, item];
      saveCart(newCart);
    }
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter((i) => i.id !== id);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
  };
}
