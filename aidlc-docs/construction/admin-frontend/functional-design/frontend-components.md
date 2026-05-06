# Frontend Components Design - Unit 6: Admin Frontend

## 컴포넌트 계층 구조

```
App
├── AuthProvider (공유)
├── CartProvider (공유, admin에서는 미사용)
├── Router
│   ├── /admin/login → AdminLoginPage
│   ├── /admin/dashboard → DashboardPage
│   │       ├── TableGrid
│   │       │   └── TableCard (반복)
│   │       └── OrderDetailModal
│   ├── /admin/menu → MenuManagePage
│   │       ├── MenuList
│   │       │   └── MenuItemRow (반복)
│   │       └── MenuFormModal
│   └── /admin/tables → TableManagePage
│           ├── TableList
│           │   └── TableRow (반복)
│           ├── TableHistoryModal
│           └── ConfirmDialog
└── CartDrawer (admin에서는 미표시)
```

---

## 페이지 컴포넌트

### AdminLoginPage
| 항목 | 내용 |
|------|------|
| **경로** | `/admin/login` |
| **State** | store_id, username, password, isLoading, error |
| **API** | POST /api/admin/login |
| **동작** | 로그인 → JWT 저장 → 대시보드 이동 |

### DashboardPage (실시간 주문 모니터링)
| 항목 | 내용 |
|------|------|
| **경로** | `/admin/dashboard` |
| **State** | tables (주문 포함), sseConnected, selectedTable |
| **API** | GET /api/admin/orders, GET /api/admin/sse/orders (SSE) |
| **동작** | SSE로 실시간 주문 수신, 테이블별 그리드 표시, 상태 변경 |

### MenuManagePage
| 항목 | 내용 |
|------|------|
| **경로** | `/admin/menu` |
| **State** | categories, menuItems, editingItem, isFormOpen |
| **API** | GET/POST/PUT/DELETE /api/admin/menu/* |
| **동작** | 메뉴 CRUD, 카테고리 관리, 순서 조정 |

### TableManagePage
| 항목 | 내용 |
|------|------|
| **경로** | `/admin/tables` |
| **State** | tables, selectedTable, historyData, showHistory |
| **API** | GET/POST /api/admin/tables/*, DELETE /api/admin/orders/* |
| **동작** | 테이블 설정, 주문 삭제, 이용 완료, 과거 내역 조회 |

---

## SSE 연결 설계

```typescript
// EventSource로 SSE 연결
const eventSource = new EventSource('/api/admin/sse/orders', {
  // JWT는 URL 파라미터로 전달 (EventSource는 헤더 미지원)
});

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // 이벤트 타입: new_order, order_status_changed, order_deleted, table_completed
  handleSSEEvent(data);
};
```
