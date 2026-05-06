# Business Rules - Unit 5: Customer Frontend

## 인증 규칙

| ID | 규칙 | 검증 위치 |
|----|------|-----------|
| BR-AUTH-01 | JWT 토큰이 없거나 만료된 경우 자동 재인증 시도 | AuthContext |
| BR-AUTH-02 | 재인증 실패 시 초기 설정 화면으로 이동 | AuthContext |
| BR-AUTH-03 | 모든 API 요청에 Authorization: Bearer {token} 헤더 포함 | Axios 인터셉터 |
| BR-AUTH-04 | 초기 설정 시 store_id, table_number, password 모두 필수 | 설정 폼 |

---

## 장바구니 규칙

| ID | 규칙 | 검증 위치 |
|----|------|-----------|
| BR-CART-01 | 메뉴 수량은 최소 1 이상 | CartContext |
| BR-CART-02 | 수량 감소 시 0이 되면 해당 항목 자동 삭제 | CartContext |
| BR-CART-03 | 총 금액 = SUM(단가 × 수량), 항상 0 이상 | CartContext |
| BR-CART-04 | 장바구니는 localStorage에 동기화 (새로고침 유지) | CartContext |
| BR-CART-05 | 같은 메뉴 추가 시 수량만 증가 (중복 항목 없음) | CartContext |
| BR-CART-06 | 장바구니 비우기는 즉시 실행 (확인 팝업 없음) | CartContext |

---

## 주문 규칙

| ID | 규칙 | 검증 위치 |
|----|------|-----------|
| BR-ORDER-01 | 장바구니가 비어있으면 주문 불가 (버튼 비활성화) | 주문 확인 페이지 |
| BR-ORDER-02 | 주문 성공 시 장바구니 즉시 비우기 | OrderConfirmPage |
| BR-ORDER-03 | 주문 성공 후 5초 카운트다운 → 메뉴 화면 자동 이동 | OrderSuccessPage |
| BR-ORDER-04 | 주문 실패 시 장바구니 유지, 에러 메시지 표시 | OrderConfirmPage |
| BR-ORDER-05 | 주문 내역은 현재 세션 주문만 표시 | OrderHistoryPage |

---

## UI/UX 규칙

| ID | 규칙 | 검증 위치 |
|----|------|-----------|
| BR-UI-01 | 모든 터치 타겟 최소 44x44px | 전체 컴포넌트 |
| BR-UI-02 | 메뉴 화면이 기본 화면 (앱 진입 시 항상 메뉴) | 라우팅 |
| BR-UI-03 | 장바구니 아이템 수 뱃지 표시 (플로팅 버튼) | CartFloatingButton |
| BR-UI-04 | 로딩 중 스켈레톤/스피너 표시 | API 호출 컴포넌트 |
| BR-UI-05 | 에러 발생 시 사용자 친화적 메시지 (기술 상세 숨김) | 에러 바운더리 |

---

## 데이터 유효성 규칙

| ID | 규칙 | 검증 위치 |
|----|------|-----------|
| BR-DATA-01 | 메뉴 가격은 양수 정수 | 서버에서 검증 (클라이언트는 표시만) |
| BR-DATA-02 | 주문 항목의 unit_price는 메뉴의 현재 가격과 일치해야 함 | 주문 생성 시 |
| BR-DATA-03 | 주문 상태는 pending/preparing/completed 중 하나 | 표시 로직 |
