export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  subtotal: number;
  deliveryCharge: number;
  bkashCharge?: number;
  paymentMethod: "cod" | "bkash";
  transactionId?: string | null;
  status: OrderStatus;
  shippingAddress: string;
  phone: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export enum OrderStatus {
  PLACED = "PLACED",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: number;
}
