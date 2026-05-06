import { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import type { Category, MenuItem } from '../../api/types';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { ErrorMessage } from '../../components/ErrorMessage';

export function MenuManagePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '', category_id: '', image_url: '' });

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [catRes, menuRes] = await Promise.all([
        apiClient.get<Category[]>('/menu/categories'),
        apiClient.get<MenuItem[]>('/menu/items'),
      ]);
      setCategories(catRes.data);
      setMenuItems(menuRes.data);
    } catch {
      setError('데이터를 불러오는데 실패했습니다');
    } finally {
      setIsLoading(false);
    }
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name: formData.name, price: parseInt(formData.price), description: formData.description, category_id: parseInt(formData.category_id), image_url: formData.image_url || null };

    try {
      if (editingItem) {
        await apiClient.put(`/admin/menu/items/${editingItem.id}`, payload);
      } else {
        await apiClient.post('/admin/menu/items', payload);
      }
      setIsFormOpen(false);
      loadData();
    } catch { /* error handling */ }
  }

  async function handleDelete(id: number) {
    if (!confirm('이 메뉴를 삭제하시겠습니까?')) return;
    try {
      await apiClient.delete(`/admin/menu/items/${id}`);
      loadData();
    } catch { /* error handling */ }
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div data-testid="menu-manage-page" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h1 style={{ fontSize: '1.3rem' }}>메뉴 관리</h1>
        <button data-testid="menu-add-button" onClick={openCreateForm} style={{ minHeight: 44, padding: '0.5rem 1rem', border: 'none', borderRadius: 8, backgroundColor: '#1976d2', color: '#fff', cursor: 'pointer' }}>+ 메뉴 추가</button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>메뉴명</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>카테고리</th>
            <th style={{ textAlign: 'right', padding: '0.5rem' }}>가격</th>
            <th style={{ textAlign: 'center', padding: '0.5rem' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr key={item.id} data-testid={`menu-row-${item.id}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '0.75rem 0.5rem' }}>{item.name}</td>
              <td style={{ padding: '0.75rem 0.5rem' }}>{categories.find(c => c.id === item.category_id)?.name}</td>
              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>{item.price.toLocaleString()}원</td>
              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                <button data-testid={`menu-edit-${item.id}`} onClick={() => openEditForm(item)} style={{ marginRight: 8, padding: '0.3rem 0.6rem', cursor: 'pointer' }}>수정</button>
                <button data-testid={`menu-delete-${item.id}`} onClick={() => handleDelete(item.id)} style={{ padding: '0.3rem 0.6rem', cursor: 'pointer', color: '#d32f2f' }}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form Modal */}
      {isFormOpen && (
        <>
          <div onClick={() => setIsFormOpen(false)} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 300 }} />
          <div data-testid="menu-form-modal" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#fff', borderRadius: 12, padding: '1.5rem', width: '90%', maxWidth: 400, zIndex: 301 }}>
            <h2>{editingItem ? '메뉴 수정' : '메뉴 추가'}</h2>
            <form onSubmit={handleSubmit}>
              <input data-testid="menu-form-name" placeholder="메뉴명" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem', border: '1px solid #e0e0e0', borderRadius: 4 }} />
              <input data-testid="menu-form-price" type="number" placeholder="가격" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem', border: '1px solid #e0e0e0', borderRadius: 4 }} />
              <textarea data-testid="menu-form-description" placeholder="설명" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem', border: '1px solid #e0e0e0', borderRadius: 4 }} />
              <select data-testid="menu-form-category" value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.75rem', border: '1px solid #e0e0e0', borderRadius: 4 }}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input data-testid="menu-form-image" placeholder="이미지 URL" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #e0e0e0', borderRadius: 4 }} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setIsFormOpen(false)} style={{ flex: 1, padding: '0.5rem', cursor: 'pointer' }}>취소</button>
                <button data-testid="menu-form-submit" type="submit" style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: 4, backgroundColor: '#1976d2', color: '#fff', cursor: 'pointer' }}>{editingItem ? '수정' : '등록'}</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
