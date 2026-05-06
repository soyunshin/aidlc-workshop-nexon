import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function TableSetupPage() {
  const [storeId, setStoreId] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!storeId || !tableNumber || !password) {
      setError('모든 필드를 입력해 주세요');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login({
        store_id: storeId,
        table_number: parseInt(tableNumber, 10),
        password,
      });
      navigate('/', { replace: true });
    } catch {
      setError('로그인에 실패했습니다. 정보를 확인해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div data-testid="table-setup-page" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#fff',
        padding: '2.5rem 2rem',
        borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        animation: 'fadeIn 0.4s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🍽️</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#333' }}>테이블 설정</h1>
          <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.25rem' }}>매장 정보를 입력해 주세요</p>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#555' }}>매장 식별자</label>
          <input
            data-testid="setup-store-id"
            type="text"
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            placeholder="예: mystore"
            style={{ width: '100%', padding: '0.85rem 1rem', border: '2px solid #e8e8e8', borderRadius: 10, fontSize: '1rem', height: 52, boxSizing: 'border-box', backgroundColor: '#fafafa' }}
          />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#555' }}>테이블 번호</label>
          <input
            data-testid="setup-table-number"
            type="number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="예: 1"
            style={{ width: '100%', padding: '0.85rem 1rem', border: '2px solid #e8e8e8', borderRadius: 10, fontSize: '1rem', height: 52, boxSizing: 'border-box', backgroundColor: '#fafafa' }}
          />
        </div>

        <div style={{ marginBottom: '1.75rem' }}>
          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.9rem', color: '#555' }}>비밀번호</label>
          <input
            data-testid="setup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{ width: '100%', padding: '0.85rem 1rem', border: '2px solid #e8e8e8', borderRadius: 10, fontSize: '1rem', height: 52, boxSizing: 'border-box', backgroundColor: '#fafafa' }}
          />
        </div>

        {error && (
          <div data-testid="setup-error" style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: 8,
            color: '#dc2626',
            fontSize: '0.9rem',
            marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        <button
          data-testid="setup-submit"
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            height: 52,
            border: 'none',
            borderRadius: 10,
            background: isLoading ? '#bdbdbd' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontSize: '1.05rem',
            fontWeight: 700,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            boxSizing: 'border-box',
            letterSpacing: '0.5px',
          }}
        >
          {isLoading ? '설정 중...' : '설정 완료'}
        </button>
      </form>
    </div>
  );
}
