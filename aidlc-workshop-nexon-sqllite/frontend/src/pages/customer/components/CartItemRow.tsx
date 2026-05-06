import type { CartItem } from '../../../api/types';

interface CartItemRowProps {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function CartItemRow({ item, onIncrease, onDecrease, onRemove }: CartItemRowProps) {
  return (
    <div data-testid={`cart-item-${item.menu_item_id}`} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
        <div style={{ color: '#666', fontSize: '0.9rem' }}>{item.price.toLocaleString()}원</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button data-testid={`cart-decrease-${item.menu_item_id}`} onClick={onDecrease} style={{ minWidth: 36, minHeight: 36, border: '1px solid #e0e0e0', borderRadius: 4, background: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>−</button>
        <span data-testid={`cart-quantity-${item.menu_item_id}`} style={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
        <button data-testid={`cart-increase-${item.menu_item_id}`} onClick={onIncrease} style={{ minWidth: 36, minHeight: 36, border: '1px solid #e0e0e0', borderRadius: 4, background: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>+</button>
        <button data-testid={`cart-remove-${item.menu_item_id}`} onClick={onRemove} style={{ minWidth: 36, minHeight: 36, border: 'none', background: 'none', cursor: 'pointer', color: '#d32f2f', fontSize: '1.2rem' }}>🗑</button>
      </div>
    </div>
  );
}
