import { useState, useEffect } from 'react';
import { mockTableData } from '../../api/mock-data';

const USE_MOCK = false;

interface TableInfo {
  id: number;
  table_number: number;
  has_active_session: boolean;
  total_amount: number;
}

export function TableManagePage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadTables(); }, []);

  async function loadTables() {
    setIsLoading(true);
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      setTables(mockTableData.map((t) => ({ id: t.table_id, table_number: t.table_number, has_active_session: t.has_active_session, total_amount: t.total_amount })));
    }
    setIsLoading(false);
  }

  function handleComplete(tableId: number) {
    if (!confirm('이 테이블의 이용을 완료 처리하시겠습니까?')) return;
    setTables((prev) => prev.map((t) => t.id === tableId ? { ...t, has_active_session: false, total_amount: 0 } : t));
  }

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div style={{ width: 40, height: 40, border: '4px solid #e0e0e0', borderTop: '4px solid #1976d2', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>;
  }

  return (
    <div data-testid="table-manage-page" style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
        <a href="/admin/dashboard" style={{ textDecoration: 'none', fontSize: '1.3rem' }}>←</a>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>🪑 테이블 관리</h1>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', backgroundColor: '#fafafa' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>테이블</th>
              <th style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>상태</th>
              <th style={{ textAlign: 'right', padding: '0.75rem 1rem' }}>총 주문액</th>
              <th style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table.id} data-testid={`table-row-${table.table_number}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>🪑 테이블 {table.table_number}</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: 12, fontSize: '0.8rem', fontWeight: 600, backgroundColor: table.has_active_session ? '#e8f5e9' : '#f5f5f5', color: table.has_active_session ? '#388e3c' : '#999' }}>
                    {table.has_active_session ? '이용중' : '비어있음'}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600 }}>{table.total_amount.toLocaleString()}원</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                  {table.has_active_session && (
                    <button data-testid={`table-complete-${table.table_number}`} onClick={() => handleComplete(table.id)} style={{ padding: '0.4rem 0.8rem', border: '1px solid #d32f2f', borderRadius: 6, color: '#d32f2f', background: '#fff', cursor: 'pointer', fontWeight: 600 }}>이용 완료</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
