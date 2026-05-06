# 테이블오더 백엔드 API 명세

## Base URL
```
http://localhost:8000
```

## 인증 방식
- **JWT Bearer Token**: `Authorization: Bearer <token>`
- 관리자 토큰: POST /api/admin/login으로 발급
- 테이블 토큰: POST /api/table/login으로 발급
- 만료: 16시간

---

## 1. Auth API

### POST /api/admin/login
관리자 로그인

**Request Body:**
```json
{
  "store_identifier": "store001",
  "username": "admin",
  "password": "admin123"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

**Errors:** 401 (Invalid credentials), 429 (Too many attempts)

---

### POST /api/table/login
테이블 로그인

**Request Body:**
```json
{
  "store_identifier": "store001",
  "table_number": 3,
  "password": "table_pass"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

---

### POST /api/admin/logout
관리자 로그아웃 (Admin JWT 필요)

**Response 200:**
```json
{
  "message": "Logged out successfully"
}
```

---

## 2. Menu API

### GET /api/menu/categories
카테고리 목록 조회 (Any JWT)

**Response 200:**
```json
[
  { "id": 1, "name": "음료", "sort_order": 0 },
  { "id": 2, "name": "식사", "sort_order": 1 }
]
```

---

### GET /api/menu/items?category_id=1
메뉴 목록 조회 (Any JWT, category_id 선택)

**Response 200:**
```json
[
  {
    "id": 1,
    "category_id": 1,
    "name": "아메리카노",
    "price": 4500,
    "description": "깊은 풍미의 에스프레소",
    "image_url": "https://example.com/americano.jpg",
    "sort_order": 0,
    "is_available": true
  }
]
```

---

### POST /api/admin/menu/categories
카테고리 등록 (Admin JWT)

**Request Body:**
```json
{
  "name": "디저트",
  "sort_order": 2
}
```

**Response 201:**
```json
{ "id": 3, "name": "디저트", "sort_order": 2 }
```

---

### PUT /api/admin/menu/categories/{id}
카테고리 수정 (Admin JWT)

**Request Body:**
```json
{ "name": "새이름", "sort_order": 5 }
```

**Response 200:** 수정된 카테고리 객체

---

### DELETE /api/admin/menu/categories/{id}
카테고리 삭제 (Admin JWT, 빈 카테고리만 가능)

**Response 204:** No Content
**Error 409:** 하위 메뉴가 있으면 삭제 불가

---

### POST /api/admin/menu/items
메뉴 등록 (Admin JWT)

**Request Body:**
```json
{
  "category_id": 1,
  "name": "카페라떼",
  "price": 5000,
  "description": "부드러운 우유 거품",
  "image_url": "https://example.com/latte.jpg",
  "sort_order": 1,
  "is_available": true
}
```

**Response 201:** 생성된 메뉴 객체

---

### PUT /api/admin/menu/items/{id}
메뉴 수정 (Admin JWT, 부분 업데이트 가능)

**Request Body (모든 필드 선택):**
```json
{ "price": 5500, "is_available": false }
```

**Response 200:** 수정된 메뉴 객체

---

### DELETE /api/admin/menu/items/{id}
메뉴 삭제 (Admin JWT)

**Response 204:** No Content

---

### PUT /api/admin/menu/items/order
메뉴 노출 순서 변경 (Admin JWT)

**Request Body:**
```json
{
  "items": [
    { "id": 1, "sort_order": 0 },
    { "id": 2, "sort_order": 1 },
    { "id": 3, "sort_order": 2 }
  ]
}
```

**Response 204:** No Content

---

## 3. Order API

### POST /api/orders
주문 생성 (Table JWT, 세션 자동 시작)

**Request Body:**
```json
{
  "items": [
    { "menu_item_id": 1, "quantity": 2 },
    { "menu_item_id": 3, "quantity": 1 }
  ]
}
```

**Response 201:**
```json
{
  "id": 1,
  "order_number": "20260506-0001",
  "status": "pending",
  "total_amount": 14000,
  "ordered_at": "2026-05-06T12:00:00",
  "items": [
    {
      "id": 1,
      "menu_item_id": 1,
      "item_name": "아메리카노",
      "unit_price": 4500,
      "quantity": 2,
      "subtotal": 9000
    },
    {
      "id": 2,
      "menu_item_id": 3,
      "item_name": "치즈케이크",
      "unit_price": 5000,
      "quantity": 1,
      "subtotal": 5000
    }
  ]
}
```

---

### GET /api/orders
내 주문 조회 (Table JWT, 현재 세션만)

**Response 200:** OrderResponse 배열 (최신순)

---

### GET /api/admin/orders
전체 활성 주문 조회 (Admin JWT)

**Response 200:** OrderResponse 배열

---

### PUT /api/admin/orders/{id}/status
주문 상태 변경 (Admin JWT)

**Request Body:**
```json
{ "status": "preparing" }
```

**허용 전이:** pending→preparing→completed (단방향만)
**Response 200:** 수정된 주문 객체
**Error 422:** 잘못된 상태 전이

---

### DELETE /api/admin/orders/{id}
주문 삭제 (Admin JWT)

**Response 204:** No Content

---

## 4. Table API

### POST /api/admin/tables
테이블 설정 (Admin JWT)

**Request Body:**
```json
{
  "table_number": 1,
  "password": "table1pass"
}
```

**Response 201:**
```json
{
  "id": 1,
  "table_number": 1,
  "has_active_session": false,
  "total_amount": 0
}
```

---

### GET /api/admin/tables
테이블 목록 + 현재 상태 (Admin JWT)

**Response 200:**
```json
[
  { "id": 1, "table_number": 1, "has_active_session": true, "total_amount": 23000 },
  { "id": 2, "table_number": 2, "has_active_session": false, "total_amount": 0 }
]
```

---

### POST /api/admin/tables/{id}/complete
이용 완료 처리 (Admin JWT)

주문 아카이브 + 세션 종료 + 총액 리셋

**Response 204:** No Content
**Error 409:** 활성 세션 없음

---

### GET /api/admin/tables/{id}/history
과거 주문 이력 (Admin JWT)

**Response 200:**
```json
[
  {
    "order_number": "20260505-0003",
    "total_amount": 15000,
    "ordered_at": "2026-05-05T18:30:00",
    "status": "completed",
    "items_count": 3
  }
]
```

---

## 5. SSE API

### GET /api/admin/sse/orders
실시간 주문 스트림 (Admin JWT)

**Response:** text/event-stream

```
event: new_order
data: {"order_id": 1, "table_number": 3, "total_amount": 14000}

event: status_changed
data: {"order_id": 1, "status": "preparing"}

: keepalive
```

**이벤트 타입:**
- `new_order`: 새 주문 생성됨
- `status_changed`: 주문 상태 변경됨
- `order_deleted`: 주문 삭제됨

---

## 공통 에러 응답 형식

```json
{
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid credentials",
    "request_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

| HTTP 코드 | 에러 코드 | 설명 |
|-----------|-----------|------|
| 401 | AUTHENTICATION_ERROR | 인증 실패/토큰 만료 |
| 403 | AUTHORIZATION_ERROR | 권한 부족 |
| 404 | NOT_FOUND | 리소스 없음 |
| 409 | CONFLICT_ERROR | 충돌 (빈 카테고리 아님 등) |
| 422 | VALIDATION_ERROR | 입력 검증 실패 |
| 429 | RATE_LIMIT_ERROR | 요청 제한 초과 |
| 500 | INTERNAL_ERROR | 서버 내부 오류 |

---

## JWT Token Payload

### Admin Token
```json
{
  "sub": "admin_1",
  "store_id": 1,
  "role": "admin",
  "exp": 1717689600,
  "iat": 1717632000
}
```

### Table Token
```json
{
  "sub": "table_5",
  "store_id": 1,
  "table_id": 5,
  "table_number": 3,
  "role": "table",
  "exp": 1717689600,
  "iat": 1717632000
}
```
