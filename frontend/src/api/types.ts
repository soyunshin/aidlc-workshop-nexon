// === Menu Types ===

export interface Category {
  id: number;
  name: string;
  display_order: number;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  price: number;
  description: string;
  image_url: string | null;
  display_order: number;
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
  menu_item_id: number;
  name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

export interface OrderCreateRequest {
  items: {
    menu_item_id: number;
    quantity: number;
    unit_price: number;
  }[];
}

export interface OrderCreateResponse {
  id: number;
  order_number: string;
  total_amount: number;
  created_at: string;
}

// === Auth Types ===

export interface TableCredentials {
  store_id: string;
  table_number: number;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface TokenPayload {
  sub: string;
  store_id: string;
  table_number: number;
  session_id: string | null;
  exp: number;
}
