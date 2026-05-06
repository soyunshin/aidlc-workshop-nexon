import { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { mockCategories, mockMenuItems } from '../../api/mock-data';
import type { Category, MenuItem } from '../../api/types';
import { useCart } from '../../contexts/CartContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { CategoryTabs } from './components/CategoryTabs';
import { MenuGrid } from './components/MenuGrid';
import { CartFloatingButton } from './components/CartFloatingButton';

const USE_MOCK = true; // 백엔드 연결 시 false로 변경

export function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem, openDrawer, itemCount } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    if (USE_MOCK) {
      // Mock 데이터 사용 (백엔드 없이 UI 확인용)
      await new Promise((r) => setTimeout(r, 500)); // 로딩 시뮬레이션
      setCategories(mockCategories);
      setMenuItems(mockMenuItems);
    } else {
      try {
        const [catRes, menuRes] = await Promise.all([
          apiClient.get<Category[]>('/menu/categories'),
          apiClient.get<MenuItem[]>('/menu/items'),
        ]);
        setCategories(catRes.data);
        setMenuItems(menuRes.data);
      } catch {
        // fallback to mock
        setCategories(mockCategories);
        setMenuItems(mockMenuItems);
      }
    }
    setIsLoading(false);
  }

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.category_id === selectedCategory)
    : menuItems;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div data-testid="menu-page" style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>🍽️ 메뉴</h1>
        <button
          onClick={() => window.location.href = '/orders'}
          style={{ padding: '0.5rem 1rem', border: '1px solid #e0e0e0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          주문내역
        </button>
      </div>

      <CategoryTabs categories={categories} selectedId={selectedCategory} onSelect={setSelectedCategory} />

      <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#fafafa' }}>
        <MenuGrid items={filteredItems} onAddToCart={addItem} />
      </div>

      <CartFloatingButton itemCount={itemCount} onClick={openDrawer} />
    </div>
  );
}
