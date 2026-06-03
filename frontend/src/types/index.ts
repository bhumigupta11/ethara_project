export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string;
  category?: string;
  image_url?: string;
  price: number;
  stock_quantity: number;
  created_at: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  customer_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface ProductFormInput {
  sku: string;
  name: string;
  description?: string;
  category?: string;
  image_url?: string;
  price: number;
  stock_quantity: number;
}

export interface CustomerFormInput {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface OrderFormInput {
  customer_id: number;
  status?: string;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
}

export interface DashboardMetrics {
  total_products: number;
  total_customers: number;
  total_orders: number;
  total_revenue: number;
  low_stock_products: number;
}

export interface RevenueTrend {
  month: string;
  revenue: number;
  orders: number;
}

export interface InventoryStatus {
  product_id: number;
  sku: string;
  name: string;
  stock_quantity: number;
  status: string;
}
