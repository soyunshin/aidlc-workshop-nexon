import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function OrderSuccessPage() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const location = useLocation();
  const orderNumber = (location.state as { orderNumber?: string })?.orderNumber || '---';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div data-testid="order-success-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>주문이 완료되었습니다!</h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>주문 번호</p>
      <p data-testid="order-success-number" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1976d2' }}>{orderNumber}</p>
      <p data-testid="order-success-countdown" style={{ marginTop: '2rem', color: '#999' }}>
        {countdown}초 후 메뉴 화면으로 이동합니다
      </p>
    </div>
  );
}
