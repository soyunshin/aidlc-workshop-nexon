import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const USE_MOCK = false;

export function OrderConfirmPage() {
  const { state, totalAmount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmitOrder() {
    if (state.items.length === 0) return;

    setIsSubmitting(true);
    setError(null);

    if (USE_MOCK) {
      // Mock: 1초 대기 후 성공
      await new Promise((r) => setTimeout(r, 1000));
      const orderNumber = `ORD-${String(Date.now()).slice(-6)}`;
      clearCart();
      navigate('/order/success', { state: { orderNumber } });
      return;
    }

    // 실제 API 호출 (백엔드 연결 시)
    try {
      const { default: apiClient } = await import('../../api/client');
      const response = await apiClient.post('/orders', {
        items: state.items.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          unit_price: item.price,
        })),
      });
      clearCart();
      navigate('/order/success', { state: { orderNumber: response.data.order_number } });
    } catch {
      setError('주문에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (state.items.length === 0) {
    return (
      <div data-testid="order-confirm-empty" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</div>
        <p style={{ color: '#999', marginBottom: '1rem' }}>장바구니가 비어있습니다</p>
        <button data-testid="order-confirm-back" onClick={() => navigate('/')} style={{ minHeight: 44, padding: '0.6rem 1.2rem', border: '1px solid #e0e0e0', borderRadius: 8, cursor: 'pointer', backgroundColor: '#fff' }}>메뉴로 돌아가기</button>
      </div>
    );
  }

  return (
    <div data-testid="order-confirm-page" style={{ padding: '1.5rem', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/')} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>←</button>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>주문 확인</h1>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: 12, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        {state.items.map((item) => (
          <div key={item.menu_item_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f5f5f5' }}>
            <span style={{ fontWeight: 600 }}>{item.name} × {item.quantity}</span>
            <span style={{ fontWeight: 600 }}>{(item.price * item.quantity).toLocaleString()}원</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.3rem', padding: '1.25rem 0', borderTop: '2px solid #333', marginTop: '1rem' }}>
        <span>총 금액</span>
        <span data-testid="order-confirm-total" style={{ color: '#1976d2' }}>{totalAmount.toLocaleString()}원</span>
      </div>

      {error && (
        <div data-testid="order-confirm-error" style={{ padding: '0.75rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: '0.9rem', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <button
        data-testid="order-confirm-submit"
        onClick={handleSubmitOrder}
        disabled={isSubmitting}
        style={{
          width: '100%',
          height: 56,
          border: 'none',
          borderRadius: 12,
          background: isSubmitting ? '#bdbdbd' : 'linear-gradient(135deg, #1976d2, #1565c0)',
          color: '#fff',
          fontSize: '1.1rem',
          fontWeight: 700,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          marginTop: '0.5rem',
        }}
      >
        {isSubmitting ? '주문 중...' : '주문 확정'}
      </button>
    </div>
  );
}
