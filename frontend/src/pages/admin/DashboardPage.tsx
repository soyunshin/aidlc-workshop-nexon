import { useState, useEffect } from 'react';
import { mockTableData, type MockTableData } from '../../api/mock-data';

const USE_MOCK = false;

export function DashboardPage() {
  const [tables, setTables] = useState<MockTableData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<MockTableData | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setIsLoading(true);
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      setTables(mockTableData);
    }
    setIsLoading(false);
  }

  function handleStatusChange(orderId: number, newStatus: string) {
    setTables((prev) =>
      prev.map((table) => ({
        ...table,
        orders: table.orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as 'pending' | 'preparing' | 'completed' } : order
        ),
      }))
    );
    if (selectedTable) {
      setSelectedTable({
        ...selectedTable,
        orders: selectedTable.orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as 'pending' | 'preparing' | 'completed' } : order
        ),
      });
    }
  }

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div style={{ width: 40, height: 40, border: '4px solid #e0e0e0', borderTop: '4px solid #1976d2', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>;
  }

  return (
    <div data-testid="dashboard-page" style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>📋 주문 대시보드</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href="/admin/menu" style={{ padding: '0.5rem 1rem', border: '1px solid #e0e0e0', borderRadius: 8, textDecoration: 'none', color: '#333', backgroundColor: '#fff' }}>메뉴관리</a>
          <a href="/admin/tables" style={{ padding: '0.5rem 1rem', border: '1px solid #e0e0e0', borderRadius: 8, textDecoration: 'none', color: '#333', backgroundColor: '#fff' }}>테이블관리</a>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {tables.map((table) => (
          <div
            key={table.table_id}
            data-testid={`table-card-${table.table_number}`}
            onClick={() => setSelectedTable(table)}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: 16,
              padding: '1.25rem',
              cursor: 'pointer',
              backgroundColor: table.orders.some((o) => o.status === 'pending') ? '#fff8e1' : '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>🪑 테이블 {table.table_number}</span>
              <span style={{ color: '#1976d2', fontWeight: 700 }}>{table.total_amount.toLocaleString()}원</span>
            </div>
            {table.orders.length === 0 ? (
              <div style={{ color: '#bbb', fontSize: '0.9rem' }}>주문 없음</div>
            ) : (
              table.orders.slice(0, 3).map((order) => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '0.3rem 0', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ color: '#555' }}>#{order.order_number} {order.items.map((i) => `${i.name}×${i.quantity}`).join(', ')}</span>
                  <span style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: 10,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#fff',
                    backgroundColor: order.status === 'pending' ? '#f9a825' : order.status === 'preparing' ? '#1976d2' : '#388e3c',
                  }}>
                    {order.status === 'pending' ? '대기' : order.status === 'preparing' ? '준비중' : '완료'}
                  </span>
                </div>
              ))
            )}
            {table.orders.length > 3 && <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.3rem' }}>+{table.orders.length - 3}건 더</div>}
          </div>
        ))}
      </div>

      {/* Order Detail Modal */}
      {selectedTable && (
        <>
          <div onClick={() => setSelectedTable(null)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 300 }} />
          <div data-testid="order-detail-modal" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', borderRadius: 16, padding: '1.5rem', width: '90%', maxWidth: 500, maxHeight: '80vh', overflowY: 'auto', zIndex: 301, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>🪑 테이블 {selectedTable.table_number} 주문 상세</h2>
              <button data-testid="modal-close" onClick={() => setSelectedTable(null)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            {selectedTable.orders.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center' }}>주문이 없습니다</p>
            ) : (
              selectedTable.orders.map((order) => (
                <div key={order.id} style={{ border: '1px solid #f0f0f0', borderRadius: 12, padding: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700 }}>#{order.order_number}</span>
                    <span style={{ fontWeight: 700, color: '#1976d2' }}>{order.total_amount.toLocaleString()}원</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {order.items.map((item, idx) => <div key={idx} style={{ color: '#555' }}>{item.name} × {item.quantity}</div>)}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {order.status === 'pending' && (
                      <button data-testid={`status-preparing-${order.id}`} onClick={() => handleStatusChange(order.id, 'preparing')} style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: 8, backgroundColor: '#1976d2', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>준비중으로</button>
                    )}
                    {order.status === 'preparing' && (
                      <button data-testid={`status-completed-${order.id}`} onClick={() => handleStatusChange(order.id, 'completed')} style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: 8, backgroundColor: '#388e3c', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>완료</button>
                    )}
                    {order.status === 'completed' && (
                      <span style={{ padding: '0.5rem 1rem', borderRadius: 8, backgroundColor: '#e8f5e9', color: '#388e3c', fontWeight: 600 }}>✓ 완료됨</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
