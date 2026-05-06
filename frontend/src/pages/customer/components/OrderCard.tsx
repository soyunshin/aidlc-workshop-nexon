import type { Order, OrderStatus } from '../../../api/types';

interface OrderCardProps {
  order: Order;
}

const statusLabels: Record<OrderStatus, string> = {
  pending: '대기중',
  preparing: '준비중',
  completed: '완료',
};

const statusColors: Record<OrderStatus, string> = {
  pending: '#f9a825',
  preparing: '#1976d2',
  completed: '#388e3c',
};

export function OrderCard({ order }: OrderCardProps) {
  const time = new Date(order.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div data-testid={`order-card-${order.id}`} style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '1rem', marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 'bold' }}>#{order.order_number}</span>
        <span
          data-testid={`order-status-${order.id}`}
          style={{ padding: '0.25rem 0.75rem', borderRadius: 12, fontSize: '0.8rem', fontWeight: 'bold', color: '#fff', backgroundColor: statusColors[order.status] }}
        >
          {statusLabels[order.status]}
        </span>
      </div>
      <div style={{ color: '#666', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{time}</div>
      <div style={{ fontSize: '0.9rem' }}>
        {order.items.map((item, idx) => (
          <span key={idx}>{item.name} ×{item.quantity}{idx < order.items.length - 1 ? ', ' : ''}</span>
        ))}
      </div>
      <div style={{ textAlign: 'right', fontWeight: 'bold', marginTop: '0.5rem' }}>{order.total_amount.toLocaleString()}원</div>
    </div>
  );
}
