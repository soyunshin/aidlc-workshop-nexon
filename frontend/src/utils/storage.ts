import type { CartItem, TableCredentials } from '../api/types';

const CART_KEY = 'table_order_cart';
const CREDENTIALS_KEY = 'table_order_credentials';

export function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function loadCart(): CartItem[] {
  const data = localStorage.getItem(CART_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as CartItem[];
  } catch {
    return [];
  }
}

export function clearCartStorage(): void {
  localStorage.removeItem(CART_KEY);
}

export function saveCredentials(credentials: TableCredentials): void {
  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
}

export function getCredentials(): TableCredentials | null {
  const data = localStorage.getItem(CREDENTIALS_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as TableCredentials;
  } catch {
    return null;
  }
}

export function clearCredentials(): void {
  localStorage.removeItem(CREDENTIALS_KEY);
}
