import type { MenuItem } from '../../../api/types';

interface MenuCardProps {
  item: MenuItem;
  onAdd: () => void;
}

export function MenuCard({ item, onAdd }: MenuCardProps) {
  return (
    <div
      data-testid={`menu-card-${item.id}`}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: 12,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          style={{ width: '100%', height: 140, objectFit: 'cover' }}
        />
      )}
      {!item.image_url && (
        <div style={{ width: '100%', height: 140, backgroundColor: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
          이미지 없음
        </div>
      )}
      <div style={{ padding: '0.75rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>{item.name}</h3>
        <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.85rem' }}>{item.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{item.price.toLocaleString()}원</span>
          <button
            data-testid={`menu-add-button-${item.id}`}
            onClick={onAdd}
            style={{
              minWidth: 44,
              minHeight: 44,
              border: 'none',
              borderRadius: 8,
              backgroundColor: '#1976d2',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: '0.5rem 0.75rem',
            }}
          >
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
