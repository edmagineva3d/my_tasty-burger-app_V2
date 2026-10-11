export interface Product {
  id: string;
  image: string;
  title: string;
  paragraph: string;
  rating: number;
  price: number;
  quantity?: number;
  soldOut?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus =
  | "Order Received"
  | "Preparing"
  | "Ready for Pickup"
  | "Completed";

export interface OrderRecord {
  id: string;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
