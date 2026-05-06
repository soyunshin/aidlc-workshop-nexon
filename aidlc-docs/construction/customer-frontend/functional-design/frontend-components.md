# Frontend Components Design - Unit 5: Customer Frontend

## 컴포넌트 계층 구조

```
App
├── AuthProvider (Context)
├── CartProvider (Context)
├── Router
│   ├── /setup → TableSetupPage
│   ├── / → MenuPage (기본 화면)
│   │       ├── CategoryTabs
│   │       ├── MenuGrid
│   │       │   └── MenuCard (반복)
│   │       └── CartFloatingButton
│   ├── /order/confirm → OrderConfirmPage
│   ├── /order/success → OrderSuccessPage
│   └── /orders → OrderHistoryPage
│           └── OrderCard (반복)
└── CartDrawer (사이드 드로어, 전역)
    └── CartItem (반복)
```

---

## 페이지 컴포넌트

### TableSetupPage
| 항목 | 내용 |
|------|------|
| **경로** | `/setup` |
| **표시 조건** | 저장된 인증 정보 없을 때 |
| **Props** | 없음 |
| **State** | store_id, table_number, password, isLoading, error |
| **API** | POST /api/table/login |
| **동작** | 입력 → 로그인 → 성공 시 localStorage 저장 → 메뉴 화면 이동 |

### MenuPage (기본 화면)
| 항목 | 내용 |
|------|------|
| **경로** | `/` |
| **Props** | 없음 |
| **State** | categories, menuItems, selectedCategory, isLoading |
| **API** | GET /api/menu/categories, GET /api/menu/items |
| **동작** | 카테고리 탭 선택 → 메뉴 필터링, 메뉴 카드 클릭 → 장바구니 추가 |

### OrderConfirmPage
| 항목 | 내용 |
|------|------|
| **경로** | `/order/confirm` |
| **Props** | 없음 (CartContext에서 데이터 가져옴) |
| **State** | isSubmitting, error |
| **API** | POST /api/orders |
| **동작** | 주문 내역 확인 → 확정 → 성공 시 /order/success 이동 |

### OrderSuccessPage
| 항목 | 내용 |
|------|------|
| **경로** | `/order/success` |
| **Props** | 없음 (location state에서 order_number 수신) |
| **State** | countdown (5→0) |
| **API** | 없음 |
| **동작** | 주문 번호 표시 → 5초 카운트다운 → 메뉴 화면 자동 이동 |

### OrderHistoryPage
| 항목 | 내용 |
|------|------|
| **경로** | `/orders` |
| **Props** | 없음 |
| **State** | orders, isLoading |
| **API** | GET /api/orders |
| **동작** | 현재 세션 주문 목록 표시 (시간순) |

---

## 공통 컴포넌트

### CategoryTabs
| 항목 | 내용 |
|------|------|
| **Props** | categories: Category[], selectedId: number, onSelect: (id) => void |
| **UI** | 가로 스크롤 탭 바, 선택된 탭 강조 |
| **터치 타겟** | 각 탭 최소 44px 높이 |

### MenuGrid
| 항목 | 내용 |
|------|------|
| **Props** | items: MenuItem[], onAddToCart: (item) => void |
| **UI** | 2열 CSS Grid, gap 12px |

### MenuCard
| 항목 | 내용 |
|------|------|
| **Props** | item: MenuItem, onAdd: () => void |
| **UI** | 이미지(상단) + 메뉴명 + 가격 + 추가 버튼 |
| **터치 타겟** | 카드 전체 또는 추가 버튼 최소 44x44px |

### CartFloatingButton
| 항목 | 내용 |
|------|------|
| **Props** | itemCount: number, onClick: () => void |
| **UI** | 우하단 고정, 장바구니 아이콘 + 수량 뱃지 |
| **표시 조건** | itemCount > 0일 때만 표시 |

### CartDrawer
| 항목 | 내용 |
|------|------|
| **Props** | isOpen: boolean, onClose: () => void |
| **State** | CartContext에서 items, totalAmount 가져옴 |
| **UI** | 오른쪽 사이드 드로어, 항목 목록 + 총액 + 주문하기 버튼 |
| **동작** | 수량 조절, 삭제, 비우기, "주문하기" → /order/confirm 이동 |

### CartItemRow
| 항목 | 내용 |
|------|------|
| **Props** | item: CartItem, onIncrease, onDecrease, onRemove |
| **UI** | 메뉴명 + 단가 + 수량 조절 버튼(-, 수량, +) + 소계 + 삭제 |

### OrderCard
| 항목 | 내용 |
|------|------|
| **Props** | order: Order |
| **UI** | 주문번호 + 시각 + 메뉴 요약 + 총액 + 상태 뱃지 |
| **상태 색상** | pending=노란, preparing=파란, completed=초록 |

---

## Context 설계

### AuthContext
```typescript
interface AuthContextValue {
  state: AuthState;
  login: (credentials: TableCredentials) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
}
```

### CartContext
```typescript
interface CartContextValue {
  state: CartState;
  addItem: (menuItem: MenuItem) => void;
  removeItem: (menuItemId: number) => void;
  increaseQuantity: (menuItemId: number) => void;
  decreaseQuantity: (menuItemId: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  totalAmount: number;   // 계산된 값
  itemCount: number;     // 계산된 값
}
```

---

## API 통합 포인트

| 컴포넌트 | API 엔드포인트 | 메서드 |
|----------|----------------|--------|
| TableSetupPage | /api/table/login | POST |
| MenuPage | /api/menu/categories | GET |
| MenuPage | /api/menu/items | GET |
| OrderConfirmPage | /api/orders | POST |
| OrderHistoryPage | /api/orders | GET |

---

## Axios 인터셉터 설계

```typescript
// 요청 인터셉터: JWT 토큰 자동 첨부
request.interceptors.request → Authorization: Bearer {token}

// 응답 인터셉터: 401 에러 시 자동 재인증
response.interceptors.response → 401 → 재인증 시도 → 실패 시 /setup 이동
```
