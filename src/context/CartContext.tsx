import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "../types";

const CART_STORAGE_KEY = "tastyBurgerCart";

interface CartContextValue {
  cartItems: CartItem[];
  addToCart: (product: Product | CartItem, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, amount: number) => void;
  updateSpecialInstructions: (id: string, instructions: string) => void;
  updateCartItem: (id: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore storage errors
    }
  }, [cartItems]);

  const addToCart = (product: Product | CartItem, qty = 1) => {
    const addQuantity = Math.max(1, qty || product.quantity || 1);
    setCartItems((currentItems) => {
      const existingIndex = currentItems.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        return currentItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + addQuantity }
            : item
        );
      }

      const newItem: CartItem = {
        ...product,
        quantity: addQuantity,
      };

      return [...currentItems, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id)
    );
  };

  const updateQuantity = (id: string, amount: number) => {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) return item;
        const newQty = item.quantity + amount;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      })
    );
  };

  const updateSpecialInstructions = (id: string, instructions: string) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, specialInstructions: instructions } : item
      )
    );
  };

  const updateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSpecialInstructions,
        updateCartItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider.");
  }

  return context;
};
