export interface Product {
  id: string;
  image: string;
  title: string;
  paragraph: string;
  rating: number;
  price: number;
  quantity?: number;
  soldOut?: boolean;
  category?: "burgers" | "fries" | "drinks" | "bundles";
  availableSizes?: Array<"Regular" | "Medium" | "Large">;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: "Regular" | "Medium" | "Large";
  selectedAddOns?: string[];
  removedIngredients?: string[];
  specialInstructions?: string;
  bundleTag?: string;
  basePrice?: number;
}

export type OrderStatus =
  | "Order Received"
  | "Preparing"
  | "Ready for Pickup"
  | "Completed";

export interface CustomerInfo {
  fullName: string;
  contactNumber: string;
  email?: string;
  address: string;
  barangay: string;
  city: string;
  province: string;
  landmark?: string;
  deliveryInstructions?: string;
}

export type PaymentMethod = "Cash on Delivery" | "GCash";

export interface AppliedDiscount {
  code: string;
  description: string;
  discountAmount: number;
  type: "percentage" | "fixed" | "student" | "bundle";
  studentDetails?: {
    schoolName: string;
    studentId: string;
  };
}

export interface OrderRecord {
  id: string;
  items: CartItem[];
  subtotal: number;
  delivery: number;
  riderTip?: number;
  discount?: AppliedDiscount | null;
  total: number;
  status: OrderStatus;
  createdAt: string;
  customer?: CustomerInfo;
  deliveryInstructions?: string;
  contactlessDelivery?: boolean;
  paymentMethod?: PaymentMethod;
  paymentDetails?: {
    changeFor?: string;
    gcashReference?: string;
  };
  estimatedDeliveryMinutes?: number;
}

export interface RecommendationBundle {
  id: string;
  title: string;
  description: string;
  category: "family" | "student" | "paired" | "budget";
  image: string;
  bundlePrice: number;
  originalPrice: number;
  servings?: string;
  badge?: string;
  itemsIncluded: string[];
  cartPayload: Omit<CartItem, "quantity">;
}
