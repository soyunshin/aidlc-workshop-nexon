import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../contexts/CartContext';
import { CartItemRow } from './CartItemRow';

export function CartDrawer() {
  const { state, closeDrawer, clearCart, totalAmount, increaseQuantity, decreaseQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (!state.isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        data-testid="cart-drawer-overlay"
        onClick={closeDrawer}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 200 }}
      />
      {/* Drawer */}
      <div
        data-testid="cart-drawer"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '85%',
          maxWidth: 400,
          height: '100%',
          backgroundColor: '#fff',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #e0e0e0' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>장바구니</h2>
          <button data-testid="cart-drawer-close" onClick={closeDrawer} style={{ minWidth: 44, minHeight: 44, border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {state.items.length === 0 ? (
            <p data-testid="cart-empty-message" style={{ textAlign: 'center', color: '#999' }}>장바구니가 비어있습니다</p>
          ) : (
            state.items.map((item) => (
              <CartItemRow
                key={item.menu_item_id}
                item={item}
                onIncrease={() => increaseQuantity(item.menu_item_id)}
                onDecrease={() => decreaseQuantity(item.menu_item_id)}
                onRemove={() => removeItem(item.menu_item_id)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div style={{ padding: '1rem', borderTop: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>총 금액</span>
              <span data-testid="cart-total-amount" style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1976d2' }}>{totalAmount.toLocaleString()}원</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                data-testid="cart-clear-button"
                onClick={clearCart}
                style={{ flex: 1, minHeight: 44, border: '1px solid #e0e0e0', borderRadius: 8, background: '#fff', cursor: 'pointer' }}
              >
                비우기
              </button>
              <button
                data-testid="cart-order-button"
                onClick={() => { closeDrawer(); navigate('/order/confirm'); }}
                style={{ flex: 2, minHeight: 44, border: 'none', borderRadius: 8, backgroundColor: '#1976d2', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
              >
                주문하기
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
