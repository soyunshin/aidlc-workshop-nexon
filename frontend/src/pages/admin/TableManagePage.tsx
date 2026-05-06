import { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

interface TableInfo {
  id: number;
  table_number: number;
  has_active_session: boolean;
  total_amount: number;
}

interface HistoryItem {
  order_number: string;
  created_at: string;
  total_amount: number;
  completed_at: string;
  items: { name: string; quantity: number }[];
}

export function TableManagePage() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  useEffect(() => { loadTables(); }, []);

  async function loadTables() {
    setIsLoading(true);
    try {
      const response = await apiClient.get<TableInfo[]>('/admin/tables');
      setTables(response.data);
    } catch {
      setError('테이블 정보를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleComplete(tableId: number) {
    if (!confirm('이 테이블의 이용을 완료 처리하시겠습니까?\n현재 주문이 과거 이력으로 이동됩니다.')) return;
    try {
      await apiClient.post(`/admin/tables/${tableId}/complete`);
      loadTables();
    } catch { /* error */ }
  }

  async function handleViewHistory(tableId: number) {
    setSelectedTableId(tableId);
    try {
      const response = await apiClient.get<HistoryItem[]>(`/admin/tables/${tableId}/history`);
      setHistoryData(response.data);
      setShowHistory(true);
    } catch { /* error */ }
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadTables} />;

  return (
    <div data-testid="table-manage-page" style={{ padding: '1rem' }}>
      <h1 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>테이블 관리</h1>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>테이블</th>
            <th style={{ textAlign: 'center', padding: '0.5rem' }}>상태</th>
            <th style={{ textAlign: 'right', padding: '0.5rem' }}>총 주문액</th>
            <th style={{ textAlign: 'center', padding: '0.5rem' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.id} data-testid={`table-row-${table.table_number}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>테이블 {table.table_number}</td>
              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                <span style={{ padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: '0.8rem', backgroundColor: table.has_active_session ? '#e8f5e9' : '#f5f5f5', color: table.has_active_session ? '#388e3c' : '#999' }}>
                  {table.has_active_session ? '이용중' : '비어있음'}
                </span>
              </td>
              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>{table.total_amount.toLocaleString()}원</td>
              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                {table.has_active_session && (
                  <button data-testid={`table-complete-${table.table_number}`} onClick={() => handleComplete(table.id)} style={{ marginRight: 8, padding: '0.3rem 0.6rem', border: '1px solid #d32f2f', borderRadius: 4, color: '#d32f2f', background: '#fff', cursor: 'pointer' }}>이용 완료</button>
                )}
                <button data-testid={`table-history-${table.table_number}`} onClick={() => handleViewHistory(table.id)} style={{ padding: '0.3rem 0.6rem', cursor: 'pointer' }}>과거 내역</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* History Modal */}
      {showHistory && (
        <>
          <div onClick={() => setShowHistory(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 300 }} />
          <div data-testid="table-history-modal" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', borderRadius: 12, padding: '1.5rem', width: '90%', maxWidth: 500, maxHeight: '80vh', overflowY: 'auto', zIndex: 301 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2>과거 주문 내역</h2>
              <button data-testid="history-close" onClick={() => setShowHistory(false)} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </div>
            {historyData.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center' }}>과거 내역이 없습니다</p>
            ) : (
              historyData.map((item, idx) => (
                <div key={idx} style={{ border: '1px solid #f0f0f0', borderRadius: 8, padding: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>#{item.order_number}</span>
                    <span style={{ fontWeight: 'bold' }}>{item.total_amount.toLocaleString()}원</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{new Date(item.completed_at).toLocaleString('ko-KR')}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
