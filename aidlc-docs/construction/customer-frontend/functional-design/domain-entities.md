# Domain Entities - Unit 5: Customer Frontend

## 클라이언트 측 도메인 모델

### Category
```typescript
interface Category {
  id: number;
  name: string;
  display_order: number;
}
```

### MenuItem
```typescript
interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  price: number;
  description: string;
  image_url: string | null;
  display_order: number;
}
```

### CartItem
```typescript
interface CartItem {
  menu_item_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}
```

### Cart (집합)
```typescript
interface Cart {
  items: CartItem[];
  total_amount: number;  // 계산된 값: SUM(price * quantity)
  item_count: number;    // 계산된 값: SUM(quantity)
}
```

### Order
```typescript
interface Order {
  id: number;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;    // ISO 8601
  items: OrderItem[];
}

type OrderStatus = 'pending' | 'preparing' | 'completed';
```

### OrderItem
```typescript
interface OrderItem {
  menu_item_id: number;
  name: string;
  quantity: number;
  unit_price: number;
}
```

### OrderCreateRequest (API 요청)
```typescript
interface OrderCreateRequest {
  items: {
    menu_item_id: number;
    quantity: number;
    unit_price: number;
  }[];
}
```

### OrderCreateResponse (API 응답)
```typescript
interface OrderCreateResponse {
  id: number;
  order_number: string;
  total_amount: number;
  created_at: string;
}
```

---

## 인증 관련 엔티티

### TableCredentials (localStorage 저장)
```typescript
interface TableCredentials {
  store_id: string;
  table_number: number;
  password: string;
}
```

### AuthToken
```typescript
interface AuthToken {
  access_token: string;
  token_type: string;  // "bearer"
}
```

### TokenPayload (JWT 디코딩)
```typescript
interface TokenPayload {
  sub: string;         // table_id
  store_id: string;
  table_number: number;
  session_id: string | null;
  exp: number;         // 만료 시간 (Unix timestamp)
}
```

---

## 상태 관리 모델

### AuthState
```typescript
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  tableInfo: {
    store_id: string;
    table_number: number;
    session_id: string | null;
  } | null;
  error: string | null;
}
```

### CartState
```typescript
interface CartState {
  items: CartItem[];
  isOpen: boolean;  // 드로어 열림/닫힘
}

// 계산된 값 (getter)
// totalAmount: number
// itemCount: number
```

---

## PBT 테스트 가능 속성 (Testable Properties)

| 속성 | 카테고리 | 설명 |
|------|----------|------|
| 장바구니 총액 불변성 | Invariant | totalAmount === SUM(item.price * item.quantity) for all items |
| 장바구니 수량 불변성 | Invariant | itemCount === SUM(item.quantity) for all items |
| 장바구니 추가 멱등성 | Idempotence | 같은 메뉴 N번 추가 = 수량 N인 단일 항목 |
| 장바구니 직렬화 라운드트립 | Round-trip | serialize(cart) → localStorage → deserialize = 원본 cart |
| 총액 비음수 | Invariant | totalAmount >= 0 항상 성립 |
| 수량 양수 | Invariant | 모든 CartItem의 quantity >= 1 |
