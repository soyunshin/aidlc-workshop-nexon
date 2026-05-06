import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import { useCart } from '../../contexts/CartContext';
import type { OrderCreateRequest, OrderCreateResponse } from '../../api/types';

export function OrderConfirmPage() {
  const { state, totalAmount, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmitOrder() {
    if (state.items.length === 0) return;

    setIsSubmitting(true);
    setError(null);

    const request: OrderCreateRequest = {
      items: state.items.map((item) => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        unit_price: item.price,
      })),
    };

    try {
      const response = await apiClient.post<OrderCreateResponse>('/orders', request);
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
      <div data-testid="order-confirm-empty" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>장바구니가 비어있습니다</p>
        <button data-testid="order-confirm-back" onClick={() => navigate('/')} style={{ minHeight: 44, padding: '0.5rem 1rem', cursor: 'pointer' }}>메뉴로 돌아가기</button>
      </div>
    );
  }

  return (
    <div data-testid="order-confirm-page" style={{ padding: '1rem', maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.3rem' }}>주문 확인</h1>

      <div style={{ marginBottom: '1rem' }}>
        {state.items.map((item) => (
          <div key={item.menu_item_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}>
            <span>{item.name} × {item.quantity}</span>
            <span>{(item.price * item.quantity).toLocaleString()}원</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', padding: '1rem 0', borderTop: '2px solid #333' }}>
        <span>총 금액</span>
        <span data-testid="order-confirm-total">{totalAmount.toLocaleString()}원</span>
      </div>

      {error && <p data-testid="order-confirm-error" style={{ color: '#d32f2f' }}>{error}</p>}

      <button
        data-testid="order-confirm-submit"
        onClick={handleSubmitOrder}
        disabled={isSubmitting}
        style={{
          width: '100%',
          minHeight: 52,
          border: 'none',
          borderRadius: 8,
          backgroundColor: isSubmitting ? '#bdbdbd' : '#1976d2',
          color: '#fff',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          marginTop: '1rem',
        }}
      >
        {isSubmitting ? '주문 중...' : '주문 확정'}
      </button>
    </div>
  );
}
