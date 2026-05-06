// === Menu Types ===

export interface Category {
  id: number;
  name: string;
  sort_order: number;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_available: boolean;
}

// === Cart Types ===

export interface CartItem {
  menu_item_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

// === Order Types ===

export type OrderStatus = 'pending' | 'preparing' | 'completed';

export interface OrderItem {
  id: number;
  menu_item_id: number | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  ordered_at: string;
  items: OrderItem[];
}

export interface OrderCreateRequest {
  items: {
    menu_item_id: number;
    quantity: number;
  }[];
}

export interface OrderCreateResponse {
  id: number;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  ordered_at: string;
  items: OrderItem[];
}

// === Auth Types ===

export interface TableCredentials {
  store_identifier: string;
  table_number: number;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface TokenPayload {
  sub: string;
  store_id: number;
  table_id: number;
  table_number: number;
  role: string;
  session_id: number | null;
  exp: number;
}
