"use client";
import { CartItemType } from "@/supabase/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartContextType = {
  cartItems: CartItemType | null;
  addToCart: (product_id: string) => void;
  removeFromCart: (product_id: string) => void;
};
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemType | null>(null);

  const addToCart = (productId: string) => {
    setCartItems((cart) => ({
      ...cart,
      [productId]: {
        quantity: (cart?.[productId]?.quantity || 0) + 1,
      },
    }));
  };

  const removeFromCart = (productId: string) => {
    if (!cartItems) return;
    if (cartItems[productId]?.quantity <= 1) {
      const { [productId]: removedItem, ...restOfCart } = cartItems;
      setCartItems(restOfCart);
      return;
    }
    setCartItems((cart) => ({
      ...cart,
      [productId]: {
        quantity: (cart?.[productId]?.quantity || 0) - 1,
      },
    }));
  };
  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const values = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
    }),
    [cartItems],
  );

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
