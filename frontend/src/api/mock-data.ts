import type { Category, MenuItem, Order } from './types';

export const mockCategories: Category[] = [
  { id: 1, name: '메인', display_order: 1 },
  { id: 2, name: '사이드', display_order: 2 },
  { id: 3, name: '음료', display_order: 3 },
];

export const mockMenuItems: MenuItem[] = [
  { id: 1, category_id: 1, name: '김치찌개', price: 8000, description: '돼지고기와 묵은지로 끓인 얼큰한 찌개', image_url: null, display_order: 1 },
  { id: 2, category_id: 1, name: '된장찌개', price: 7500, description: '두부와 야채가 듬뿍 들어간 구수한 찌개', image_url: null, display_order: 2 },
  { id: 3, category_id: 1, name: '제육볶음', price: 9000, description: '매콤달콤 양념에 볶은 돼지고기', image_url: null, display_order: 3 },
  { id: 4, category_id: 1, name: '비빔밥', price: 8500, description: '신선한 야채와 고추장의 조화', image_url: null, display_order: 4 },
  { id: 5, category_id: 1, name: '불고기', price: 11000, description: '달콤한 간장 양념의 소고기 불고기', image_url: null, display_order: 5 },
  { id: 6, category_id: 2, name: '계란말이', price: 5000, description: '부드러운 계란말이', image_url: null, display_order: 1 },
  { id: 7, category_id: 2, name: '감자튀김', price: 4500, description: '바삭한 감자튀김', image_url: null, display_order: 2 },
  { id: 8, category_id: 2, name: '떡볶이', price: 5500, description: '매콤한 떡볶이', image_url: null, display_order: 3 },
  { id: 9, category_id: 3, name: '콜라', price: 2000, description: '시원한 콜라 500ml', image_url: null, display_order: 1 },
  { id: 10, category_id: 3, name: '사이다', price: 2000, description: '청량한 사이다 500ml', image_url: null, display_order: 2 },
  { id: 11, category_id: 3, name: '맥주', price: 4000, description: '시원한 생맥주 500ml', image_url: null, display_order: 3 },
];

export const mockOrders: Order[] = [
  {
    id: 1,
    order_number: 'ORD-001',
    status: 'completed',
    total_amount: 17500,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    items: [
      { menu_item_id: 1, name: '김치찌개', quantity: 1, unit_price: 8000 },
      { menu_item_id: 3, name: '제육볶음', quantity: 1, unit_price: 9000 },
    ],
  },
  {
    id: 2,
    order_number: 'ORD-002',
    status: 'preparing',
    total_amount: 11000,
    created_at: new Date(Date.now() - 600000).toISOString(),
    items: [
      { menu_item_id: 5, name: '불고기', quantity: 1, unit_price: 11000 },
    ],
  },
];


// === Admin Mock Data ===

export interface MockTableData {
  table_number: number;
  table_id: number;
  total_amount: number;
  has_active_session: boolean;
  orders: {
    id: number;
    order_number: string;
    status: 'pending' | 'preparing' | 'completed';
    total_amount: number;
    created_at: string;
    items: { name: string; quantity: number }[];
  }[];
}

export const mockTableData: MockTableData[] = [
  {
    table_number: 1,
    table_id: 1,
    total_amount: 25000,
    has_active_session: true,
    orders: [
      { id: 1, order_number: 'ORD-001', status: 'pending', total_amount: 16000, created_at: new Date(Date.now() - 120000).toISOString(), items: [{ name: '김치찌개', quantity: 2 }] },
      { id: 2, order_number: 'ORD-002', status: 'preparing', total_amount: 9000, created_at: new Date(Date.now() - 300000).toISOString(), items: [{ name: '제육볶음', quantity: 1 }] },
    ],
  },
  {
    table_number: 2,
    table_id: 2,
    total_amount: 18500,
    has_active_session: true,
    orders: [
      { id: 3, order_number: 'ORD-003', status: 'completed', total_amount: 8500, created_at: new Date(Date.now() - 600000).toISOString(), items: [{ name: '비빔밥', quantity: 1 }] },
      { id: 4, order_number: 'ORD-004', status: 'pending', total_amount: 10000, created_at: new Date(Date.now() - 60000).toISOString(), items: [{ name: '불고기', quantity: 1 }, { name: '콜라', quantity: 1 }] },
    ],
  },
  {
    table_number: 3,
    table_id: 3,
    total_amount: 0,
    has_active_session: false,
    orders: [],
  },
  {
    table_number: 4,
    table_id: 4,
    total_amount: 13500,
    has_active_session: true,
    orders: [
      { id: 5, order_number: 'ORD-005', status: 'preparing', total_amount: 13500, created_at: new Date(Date.now() - 180000).toISOString(), items: [{ name: '된장찌개', quantity: 1 }, { name: '계란말이', quantity: 1 }, { name: '맥주', quantity: 1 }] },
    ],
  },
  {
    table_number: 5,
    table_id: 5,
    total_amount: 0,
    has_active_session: false,
    orders: [],
  },
];
