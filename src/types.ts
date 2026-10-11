export interface Product {
  id: string;
  image: string;
  title: string;
  paragraph: string;
  rating: number;
  price: number;
  quantity?: number;
}

export interface CartItem extends Product {
  quantity: number;
}
