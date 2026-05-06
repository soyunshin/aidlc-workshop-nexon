import type { Category } from '../../../api/types';

interface CategoryTabsProps {
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export function CategoryTabs({ categories, selectedId, onSelect }: CategoryTabsProps) {
  return (
    <div data-testid="category-tabs" style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0.75rem 1rem', borderBottom: '1px solid #e0e0e0' }}>
      <button
        data-testid="category-tab-all"
        onClick={() => onSelect(null)}
        style={{
          minWidth: 44,
          minHeight: 44,
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: 20,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          backgroundColor: selectedId === null ? '#1976d2' : '#f5f5f5',
          color: selectedId === null ? '#fff' : '#333',
          fontWeight: selectedId === null ? 'bold' : 'normal',
        }}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          data-testid={`category-tab-${cat.id}`}
          onClick={() => onSelect(cat.id)}
          style={{
            minWidth: 44,
            minHeight: 44,
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: 20,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            backgroundColor: selectedId === cat.id ? '#1976d2' : '#f5f5f5',
            color: selectedId === cat.id ? '#fff' : '#333',
            fontWeight: selectedId === cat.id ? 'bold' : 'normal',
          }}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
