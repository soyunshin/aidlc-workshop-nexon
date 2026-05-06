import { useState, useEffect } from 'react';
import { mockCategories, mockMenuItems } from '../../api/mock-data';
import type { Category, MenuItem } from '../../api/types';

const USE_MOCK = false;

export function MenuManagePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', category_id: '', image_url: '' });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setIsLoading(true);
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      setCategories(mockCategories);
      setMenuItems(mockMenuItems);
    }
    setIsLoading(false);
  }

  function openCreateForm() {
    setEditingItem(null);
    setFormData({ name: '', price: '', description: '', category_id: categories[0]?.id.toString() || '', image_url: '' });
    setIsFormOpen(true);
  }

  function openEditForm(item: MenuItem) {
    setEditingItem(item);
    setFormData({ name: item.name, price: item.price.toString(), description: item.description, category_id: item.category_id.toString(), image_url: item.image_url || '' });
    setIsFormOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingItem) {
      setMenuItems((prev) => prev.map((i) => i.id === editingItem.id ? { ...i, name: formData.name, price: parseInt(formData.price), description: formData.description, category_id: parseInt(formData.category_id), image_url: formData.image_url || null } : i));
    } else {
      const newItem: MenuItem = { id: Date.now(), name: formData.name, price: parseInt(formData.price), description: formData.description, category_id: parseInt(formData.category_id), image_url: formData.image_url || null, display_order: menuItems.length + 1 };
      setMenuItems((prev) => [...prev, newItem]);
    }
    setIsFormOpen(false);
  }

  function handleDelete(id: number) {
    if (!confirm('이 메뉴를 삭제하시겠습니까?')) return;
    setMenuItems((prev) => prev.filter((i) => i.id !== id));
  }

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div style={{ width: 40, height: 40, border: '4px solid #e0e0e0', borderTop: '4px solid #1976d2', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /><style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style></div>;
  }

  return (
    <div data-testid="menu-manage-page" style={{ padding: '1.5rem', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href="/admin/dashboard" style={{ textDecoration: 'none', fontSize: '1.3rem' }}>←</a>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700 }}>🍽️ 메뉴 관리</h1>
        </div>
        <button data-testid="menu-add-button" onClick={openCreateForm} style={{ minHeight: 44, padding: '0.6rem 1.2rem', border: 'none', borderRadius: 10, backgroundColor: '#1976d2', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>+ 메뉴 추가</button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0', backgroundColor: '#fafafa' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>메뉴명</th>
              <th style={{ textAlign: 'left', padding: '0.75rem 1rem' }}>카테고리</th>
              <th style={{ textAlign: 'right', padding: '0.75rem 1rem' }}>가격</th>
              <th style={{ textAlign: 'center', padding: '0.75rem 1rem' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item) => (
              <tr key={item.id} data-testid={`menu-row-${item.id}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{item.name}</td>
                <td style={{ padding: '0.75rem 1rem', color: '#666' }}>{categories.find((c) => c.id === item.category_id)?.name}</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: 600 }}>{item.price.toLocaleString()}원</td>
                <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                  <button data-testid={`menu-edit-${item.id}`} onClick={() => openEditForm(item)} style={{ marginRight: 8, padding: '0.4rem 0.8rem', border: '1px solid #e0e0e0', borderRadius: 6, cursor: 'pointer', backgroundColor: '#fff' }}>수정</button>
                  <button data-testid={`menu-delete-${item.id}`} onClick={() => handleDelete(item.id)} style={{ padding: '0.4rem 0.8rem', border: '1px solid #ffcdd2', borderRadius: 6, cursor: 'pointer', color: '#d32f2f', backgroundColor: '#fff' }}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <>
          <div onClick={() => setIsFormOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 300 }} />
          <div data-testid="menu-form-modal" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', borderRadius: 16, padding: '2rem', width: '90%', maxWidth: 420, zIndex: 301, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>{editingItem ? '메뉴 수정' : '메뉴 추가'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.9rem' }}>메뉴명</label>
                <input data-testid="menu-form-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.7rem', border: '2px solid #e8e8e8', borderRadius: 8, fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.9rem' }}>가격</label>
                <input data-testid="menu-form-price" type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '0.7rem', border: '2px solid #e8e8e8', borderRadius: 8, fontSize: '1rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.9rem' }}>설명</label>
                <textarea data-testid="menu-form-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.7rem', border: '2px solid #e8e8e8', borderRadius: 8, fontSize: '1rem', boxSizing: 'border-box', minHeight: 80 }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: 600, fontSize: '0.9rem' }}>카테고리</label>
                <select data-testid="menu-form-category" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} style={{ width: '100%', padding: '0.7rem', border: '2px solid #e8e8e8', borderRadius: 8, fontSize: '1rem', boxSizing: 'border-box' }}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setIsFormOpen(false)} style={{ flex: 1, padding: '0.7rem', border: '1px solid #e0e0e0', borderRadius: 8, cursor: 'pointer', backgroundColor: '#fff', fontWeight: 600 }}>취소</button>
                <button data-testid="menu-form-submit" type="submit" style={{ flex: 1, padding: '0.7rem', border: 'none', borderRadius: 8, backgroundColor: '#1976d2', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>{editingItem ? '수정' : '등록'}</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
