interface CartFloatingButtonProps {
  itemCount: number;
  onClick: () => void;
}

export function CartFloatingButton({ itemCount, onClick }: CartFloatingButtonProps) {
  if (itemCount === 0) return null;

  return (
    <button
      data-testid="cart-floating-button"
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: '50%',
        border: 'none',
        backgroundColor: '#1976d2',
        color: '#fff',
        fontSize: '1.5rem',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      🛒
      <span
        style={{
          position: 'absolute',
          top: -4,
          right: -4,
          backgroundColor: '#d32f2f',
          color: '#fff',
          borderRadius: '50%',
          width: 24,
          height: 24,
          fontSize: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
        }}
      >
        {itemCount}
      </span>
    </button>
  );
}
