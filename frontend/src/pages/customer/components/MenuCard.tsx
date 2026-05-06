import type { MenuItem } from '../../../api/types';

interface MenuCardProps {
  item: MenuItem;
  onAdd: () => void;
}

const emojiMap: Record<string, string> = {
  '김치찌개': '🍲',
  '된장찌개': '🥘',
  '제육볶음': '🥩',
  '비빔밥': '🍚',
  '불고기': '🥓',
  '계란말이': '🥚',
  '감자튀김': '🍟',
  '떡볶이': '🌶️',
  '콜라': '🥤',
  '사이다': '🧊',
  '맥주': '🍺',
};

const colorMap: Record<string, string> = {
  '김치찌개': '#ff6b6b',
  '된장찌개': '#a0522d',
  '제육볶음': '#e74c3c',
  '비빔밥': '#27ae60',
  '불고기': '#8b4513',
  '계란말이': '#f39c12',
  '감자튀김': '#f1c40f',
  '떡볶이': '#e91e63',
  '콜라': '#2c3e50',
  '사이다': '#00bcd4',
  '맥주': '#ff9800',
};

export function MenuCard({ item, onAdd }: MenuCardProps) {
  const emoji = emojiMap[item.name] || '🍽️';
  const bgColor = colorMap[item.name] || '#9e9e9e';

  return (
    <div
      data-testid={`menu-card-${item.id}`}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.name}
          style={{ width: '100%', height: 140, objectFit: 'cover' }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: 140,
          background: `linear-gradient(135deg, ${bgColor}dd, ${bgColor}88)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3.5rem',
        }}>
          {emoji}
        </div>
      )}
      <div style={{ padding: '0.85rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{item.name}</h3>
        <p style={{ margin: '0.3rem 0', color: '#888', fontSize: '0.8rem', lineHeight: 1.3 }}>{item.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#333' }}>{item.price.toLocaleString()}원</span>
          <button
            data-testid={`menu-add-button-${item.id}`}
            onClick={onAdd}
            style={{
              minWidth: 44,
              minHeight: 44,
              border: 'none',
              borderRadius: 10,
              backgroundColor: '#1976d2',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              padding: '0.5rem 0.85rem',
            }}
          >
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
