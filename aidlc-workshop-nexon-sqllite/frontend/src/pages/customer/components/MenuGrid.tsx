import type { MenuItem } from '../../../api/types';
import { MenuCard } from './MenuCard';

interface MenuGridProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

export function MenuGrid({ items, onAddToCart }: MenuGridProps) {
  if (items.length === 0) {
    return (
      <div data-testid="menu-grid-empty" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
        메뉴가 없습니다
      </div>
    );
  }

  return (
    <div
      data-testid="menu-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
        padding: '1rem',
      }}
    >
      {items.map((item) => (
        <MenuCard key={item.id} item={item} onAdd={() => onAddToCart(item)} />
      ))}
    </div>
  );
}
