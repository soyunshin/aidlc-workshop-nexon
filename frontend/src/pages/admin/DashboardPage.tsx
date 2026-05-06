import { useState, useEffect, useRef } from 'react';
import apiClient from '../../api/client';
import { getToken } from '../../utils/token';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

interface TableOrder {
  id: number;
  order_number: string;
  status: 'pending' | 'preparing' | 'completed';
  total_amount: number;
  created_at: string;
  items: { name: string; quantity: number }[];
}

interface TableData {
  table_number: number;
  table_id: number;
  total_amount: number;
  orders: TableOrder[];
}

export function DashboardPage() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    loadOrders();
    connectSSE();
    return () => { eventSourceRef.current?.close(); };
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    try {
      const response = await apiClient.get<TableData[]>('/admin/orders');
      setTables(response.data);
    } catch {
      setError('주문 데이터를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }

  function connectSSE() {
    const token = getToken();
    const url = `/api/admin/sse/orders?token=${token}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleSSEEvent(data);
      } catch { /* ignore parse errors */ }
    };

    es.onerror = () => {
      es.close();
      setTimeout(connectSSE, 3000);
    };
  }

  function handleSSEEvent(data: { type: string; payload: unknown }) {
    if (data.type === 'new_order' || data.type === 'order_status_changed' || data.type === 'order_deleted' || data.type === 'table_completed') {
      loadOrders();
    }
  }

  async function handleStatusChange(orderId: number, newStatus: string) {
    try {
      await apiClient.put(`/admin/orders/${orderId}/status`, { status: newStatus });
    } catch { /* SSE will refresh */ }
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadOrders} />;

  return (
    <div data-testid="dashboard-page" style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>주문 대시보드</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {tables.map((table) => (
          <div
            key={table.table_id}
            data-testid={`table-card-${table.table_number}`}
            onClick={() => setSelectedTable(table)}
            style={{ border: '1px solid #e0e0e0', borderRadius: 12, padding: '1rem', cursor: 'pointer', backgroundColor: table.orders.some(o => o.status === 'pending') ? '#fff3e0' : '#fff' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>테이블 {table.table_number}</span>
              <span style={{ color: '#1976d2', fontWeight: 'bold' }}>{table.total_amount.toLocaleString()}원</span>
            </div>
            {table.orders.slice(0, 3).map((order) => (
              <div key={order.id} style={{ fontSize: '0.85rem', color: '#666', padding: '0.25rem 0' }}>
                #{order.order_number} - {order.items.map(i => `${i.name}×${i.quantity}`).join(', ')}
              </div>
            ))}
            {table.orders.length > 3 && <div style={{ fontSize: '0.8rem', color: '#999' }}>+{table.orders.length - 3}건 더</div>}
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selectedTable && (
        <>
          <div onClick={() => setSelectedTable(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 300 }} />
          <div data-testid="order-detail-modal" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', borderRadius: 12, padding: '1.5rem', width: '90%', maxWidth: 500, maxHeight: '80vh', overflowY: 'auto', zIndex: 301 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2>테이블 {selectedTable.table_number} 주문 상세</h2>
              <button data-testid="modal-close" onClick={() => setSelectedTable(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            {selectedTable.orders.map((order) => (
              <div key={order.id} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>#{order.order_number}</span>
                  <span>{order.total_amount.toLocaleString()}원</span>
                </div>
                <div style={{ fontSize: '0.9rem', margin: '0.5rem 0' }}>
                  {order.items.map((item, idx) => <div key={idx}>{item.name} × {item.quantity}</div>)}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {order.status === 'pending' && <button data-testid={`status-preparing-${order.id}`} onClick={() => handleStatusChange(order.id, 'preparing')} style={{ padding: '0.4rem 0.8rem', border: 'none', borderRadius: 4, backgroundColor: '#1976d2', color: '#fff', cursor: 'pointer' }}>준비중으로</button>}
                  {order.status === 'preparing' && <button data-testid={`status-completed-${order.id}`} onClick={() => handleStatusChange(order.id, 'completed')} style={{ padding: '0.4rem 0.8rem', border: 'none', borderRadius: 4, backgroundColor: '#388e3c', color: '#fff', cursor: 'pointer' }}>완료</button>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
