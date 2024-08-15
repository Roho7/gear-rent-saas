import { CartItemType } from "@/supabase/types";
import { createContext, useContext, useMemo, useState } from "react";

type CartContextType = {
  cartItems: CartItemType;
  addToCart: (product_id: string) => void;
  removeFromCart: (product_id: string) => void;
};
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItemType>({});

  const addToCart = (productId: string) => {
    setCartItems((cart) => ({
      ...cart,
      [productId]: {
        quantity: (cart[productId]?.quantity || 0) + 1,
      },
    }));
  };

  const removeFromCart = (productId: string) => {
    if (cartItems[productId]?.quantity <= 1) {
      const { [productId]: removedItem, ...restOfCart } = cartItems;
      setCartItems(restOfCart);
      return;
    }
    setCartItems((cart) => ({
      ...cart,
      [productId]: {
        quantity: (cart[productId]?.quantity || 0) - 1,
      },
    }));
  };

  //   const modifyCartItemQuantity = (productId: string, newQuantity: number) => {
  //     if (newQuantity <= 0) {
  //       return removeFromCart(cart, productId);
  //     }
  //     return {
  //       ...cart,
  //       [productId]: {
  //         quantity: newQuantity,
  //       },
  //     };
  //   };

  const values = useMemo(
    () => ({
      cartItems,
      addToCart,
      removeFromCart,
    }),
    [cartItems, addToCart, removeFromCart],
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
