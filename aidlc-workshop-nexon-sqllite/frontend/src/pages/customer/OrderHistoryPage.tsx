import { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { mockOrders } from '../../api/mock-data';
import type { Order } from '../../api/types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { OrderCard } from './components/OrderCard';

const USE_MOCK = false;

export function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      setOrders(mockOrders);
    } else {
      try {
        const response = await apiClient.get<Order[]>('/orders');
        setOrders(response.data);
      } catch {
        setOrders(mockOrders);
      }
    }
    setIsLoading(false);
  }

  if (isLoading) return <LoadingSpinner />;

  return (
    <div data-testid="order-history-page" style={{ padding: '1.5rem', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={() => window.location.href = '/'} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', marginRight: '0.5rem' }}>←</button>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>주문 내역</h1>
      </div>
      {orders.length === 0 ? (
        <p data-testid="order-history-empty" style={{ textAlign: 'center', color: '#999', padding: '3rem 0' }}>주문 내역이 없습니다</p>
      ) : (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
}
