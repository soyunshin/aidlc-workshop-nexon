# Code Generation Plan - Unit 5: Customer Frontend

## Unit Context

- **유닛**: customer-frontend
- **프로젝트 유형**: Greenfield 모노레포 (모놀리스)
- **코드 위치**: `frontend/` (workspace root 기준)
- **담당 스토리**: US-01, US-02, US-03, US-04, US-05
- **의존성**: 백엔드 API (Unit 2, 3, 4) - Mock으로 개발

## 기술 스택
- React 18 + TypeScript 5
- Vite 5 (빌드)
- React Router 6 (라우팅)
- Axios (HTTP)
- React Context + useReducer (상태 관리)
- Vitest + React Testing Library + fast-check (테스트)

---

## 코드 생성 단계

### Step 1: 프로젝트 초기 설정
- [ ] Vite + React + TypeScript 프로젝트 생성 (`frontend/`)
- [ ] package.json 의존성 설정
- [ ] tsconfig.json (strict 모드)
- [ ] vite.config.ts
- [ ] ESLint + Prettier 설정
- [ ] 디렉토리 구조 생성

### Step 2: 공통 인프라 코드
- [ ] `frontend/src/api/client.ts` - Axios 인스턴스 (인터셉터 포함)
- [ ] `frontend/src/api/types.ts` - API 요청/응답 타입 정의
- [ ] `frontend/src/utils/storage.ts` - localStorage 유틸리티
- [ ] `frontend/src/utils/token.ts` - JWT 디코딩/만료 체크

### Step 3: Context (상태 관리)
- [ ] `frontend/src/contexts/AuthContext.tsx` - 인증 상태 관리
- [ ] `frontend/src/contexts/CartContext.tsx` - 장바구니 상태 관리

### Step 4: Context 단위 테스트
- [ ] `frontend/src/contexts/__tests__/CartContext.test.tsx` - 장바구니 로직 테스트
- [ ] `frontend/src/contexts/__tests__/CartContext.property.test.tsx` - PBT (총액 불변성, 라운드트립)

### Step 5: 공통 UI 컴포넌트
- [ ] `frontend/src/components/LoadingSpinner.tsx`
- [ ] `frontend/src/components/ErrorMessage.tsx`
- [ ] `frontend/src/components/ErrorBoundary.tsx`

### Step 6: 고객 페이지 - MenuPage
- [ ] `frontend/src/pages/customer/MenuPage.tsx` - 메뉴 조회 페이지
- [ ] `frontend/src/pages/customer/components/CategoryTabs.tsx` - 카테고리 탭
- [ ] `frontend/src/pages/customer/components/MenuGrid.tsx` - 메뉴 그리드
- [ ] `frontend/src/pages/customer/components/MenuCard.tsx` - 메뉴 카드

### Step 7: 고객 페이지 - Cart
- [ ] `frontend/src/pages/customer/components/CartFloatingButton.tsx` - 플로팅 버튼
- [ ] `frontend/src/pages/customer/components/CartDrawer.tsx` - 사이드 드로어
- [ ] `frontend/src/pages/customer/components/CartItemRow.tsx` - 장바구니 항목

### Step 8: 고객 페이지 - Order
- [ ] `frontend/src/pages/customer/OrderConfirmPage.tsx` - 주문 확인
- [ ] `frontend/src/pages/customer/OrderSuccessPage.tsx` - 주문 성공 (5초 카운트다운)
- [ ] `frontend/src/pages/customer/OrderHistoryPage.tsx` - 주문 내역
- [ ] `frontend/src/pages/customer/components/OrderCard.tsx` - 주문 카드

### Step 9: 고객 페이지 - Auth
- [ ] `frontend/src/pages/customer/TableSetupPage.tsx` - 초기 설정 페이지

### Step 10: 라우팅 및 App 진입점
- [ ] `frontend/src/App.tsx` - 라우터 설정, Provider 래핑
- [ ] `frontend/src/main.tsx` - 진입점
- [ ] `frontend/index.html` - HTML 템플릿

### Step 11: 컴포넌트 단위 테스트
- [ ] `frontend/src/pages/customer/__tests__/MenuPage.test.tsx`
- [ ] `frontend/src/pages/customer/__tests__/OrderConfirmPage.test.tsx`
- [ ] `frontend/src/pages/customer/__tests__/CartDrawer.test.tsx`

### Step 12: 코드 생성 요약 문서
- [ ] `aidlc-docs/construction/customer-frontend/code/code-summary.md` - 생성된 코드 요약

---

## 스토리 매핑

| Step | 관련 스토리 |
|------|-------------|
| Step 2, 3, 9 | US-01 (자동 로그인) |
| Step 6 | US-02 (메뉴 조회) |
| Step 3, 4, 7 | US-03 (장바구니) |
| Step 8 | US-04 (주문 생성), US-05 (주문 내역) |
