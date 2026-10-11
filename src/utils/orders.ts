import type { OrderRecord, OrderStatus } from "../types";

const ORDER_STORAGE_KEY = "tastyBurgerOrders";

export const orderStatuses: OrderStatus[] = [
  "Order Received",
  "Preparing",
  "Ready for Pickup",
  "Completed",
];

export function getOrders(): OrderRecord[] {
  try {
    const saved = localStorage.getItem(ORDER_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as OrderRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: OrderRecord): void {
  const orders = getOrders();
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify([order, ...orders]));
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const orders = getOrders().map((order) =>
    order.id === orderId ? { ...order, status } : order
  );
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
}
