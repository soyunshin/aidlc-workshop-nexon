import type { TokenPayload } from '../api/types';

const TOKEN_KEY = 'auth_token';
const ADMIN_TOKEN_KEY = 'admin_auth_token';

export function getToken(): string | null {
  // Admin pages use admin token, customer pages use table token
  const adminToken = localStorage.getItem(ADMIN_TOKEN_KEY);
  const tableToken = localStorage.getItem(TOKEN_KEY);
  
  // If on admin page, prefer admin token
  if (window.location.pathname.startsWith('/admin') && adminToken) {
    return adminToken;
  }
  // Otherwise use table token, or fall back to admin token
  return tableToken || adminToken;
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function clearAdminAuth(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded) as TokenPayload;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}
