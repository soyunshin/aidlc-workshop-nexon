import type { Category, MenuItem, Order } from './types';

export const mockCategories: Category[] = [
  { id: 1, name: '메인', sort_order: 1 },
  { id: 2, name: '사이드', sort_order: 2 },
  { id: 3, name: '음료', sort_order: 3 },
];

export const mockMenuItems: MenuItem[] = [
  { id: 1, category_id: 1, name: '김치찌개', price: 8000, description: '돼지고기와 묵은지로 끓인 얼큰한 찌개', image_url: 'https://loremflickr.com/300/200/kimchi,stew', sort_order: 1, is_available: true },
  { id: 2, category_id: 1, name: '된장찌개', price: 7500, description: '두부와 야채가 듬뿍 들어간 구수한 찌개', image_url: 'https://loremflickr.com/300/200/miso,soup', sort_order: 2, is_available: true },
  { id: 3, category_id: 1, name: '제육볶음', price: 9000, description: '매콤달콤 양념에 볶은 돼지고기', image_url: 'https://loremflickr.com/300/200/spicy-pork,korean-bbq', sort_order: 3, is_available: true },
  { id: 4, category_id: 1, name: '비빔밥', price: 8500, description: '신선한 야채와 고추장의 조화', image_url: 'https://loremflickr.com/300/200/rice-bowl,vegetables', sort_order: 4, is_available: true },
  { id: 5, category_id: 1, name: '불고기', price: 11000, description: '달콤한 간장 양념의 소고기 불고기', image_url: 'https://loremflickr.com/300/200/grilled-meat,beef', sort_order: 5, is_available: true },
  { id: 6, category_id: 2, name: '계란말이', price: 5000, description: '부드러운 계란말이', image_url: 'https://loremflickr.com/300/200/omelette,egg-dish', sort_order: 1, is_available: true },
  { id: 7, category_id: 2, name: '감자튀김', price: 4500, description: '바삭한 감자튀김', image_url: 'https://loremflickr.com/300/200/french-fries,potato', sort_order: 2, is_available: true },
  { id: 8, category_id: 2, name: '떡볶이', price: 5500, description: '매콤한 떡볶이', image_url: 'https://loremflickr.com/300/200/rice-cake,spicy-food', sort_order: 3, is_available: true },
  { id: 9, category_id: 3, name: '콜라', price: 2000, description: '시원한 콜라 500ml', image_url: 'https://loremflickr.com/300/200/cola,soda-drink', sort_order: 1, is_available: true },
  { id: 10, category_id: 3, name: '사이다', price: 2000, description: '청량한 사이다 500ml', image_url: null, sort_order: 2, is_available: true },
  { id: 11, category_id: 3, name: '맥주', price: 4000, description: '시원한 생맥주 500ml', image_url: 'https://loremflickr.com/300/200/beer,draft-beer', sort_order: 3, is_available: true },
];

export const mockOrders: Order[] = [
  {
    id: 1,
    order_number: 'ORD-001',
    status: 'completed',
    total_amount: 17500,
    ordered_at: new Date(Date.now() - 3600000).toISOString(),
    items: [
      { id: 1, menu_item_id: 1, item_name: '김치찌개', quantity: 1, unit_price: 8000, subtotal: 8000 },
      { id: 2, menu_item_id: 3, item_name: '제육볶음', quantity: 1, unit_price: 9000, subtotal: 9000 },
    ],
  },
  {
    id: 2,
    order_number: 'ORD-002',
    status: 'preparing',
    total_amount: 11000,
    ordered_at: new Date(Date.now() - 600000).toISOString(),
    items: [
      { id: 3, menu_item_id: 5, item_name: '불고기', quantity: 1, unit_price: 11000, subtotal: 11000 },
    ],
  },
];
