# 컴포넌트 의존성 및 통신 패턴 - 테이블오더 서비스

## 의존성 매트릭스

| 컴포넌트 | 의존 대상 | 통신 방식 |
|----------|-----------|-----------|
| FE-Customer | BE-Auth, BE-Menu, BE-Order | HTTP REST (Axios) |
| FE-Admin | BE-Auth, BE-Menu, BE-Order, BE-Table, BE-SSE | HTTP REST + SSE |
| BE-Auth | BE-Core (DB) | 내부 함수 호출 |
| BE-Menu | BE-Core (DB) | 내부 함수 호출 |
| BE-Order | BE-Core (DB), BE-SSE, BE-Table | 내부 함수 호출 |
| BE-Table | BE-Core (DB), BE-Order, BE-SSE | 내부 함수 호출 |
| BE-SSE | (독립, 인메모리 큐) | AsyncGenerator |
| BE-Core | MySQL DB | SQLAlchemy ORM |

---

## 통신 패턴

### 1. 클라이언트 → 서버 (HTTP REST)
```
Frontend (React) ──HTTP/HTTPS──→ Backend (FastAPI)
                                      │
                                      ├── JSON Request/Response
                                      ├── JWT Bearer Token (Authorization Header)
                                      └── Content-Type: application/json
```

### 2. 서버 → 클라이언트 (SSE)
```
Backend (FastAPI) ──SSE──→ Admin Frontend (React)
                               │
                               ├── text/event-stream
                               ├── 단방향 (서버 → 클라이언트)
                               └── 자동 재연결 (EventSource API)
```

### 3. 서비스 내부 (함수 호출)
```
Router ──DI──→ Service ──DI──→ Repository ──ORM──→ Database
         │              │
         │              └── FastAPI Depends (의존성 주입)
         └── Pydantic 모델 (요청/응답 직렬화)
```

---

## 데이터 흐름

### 주문 생성 흐름
```
1. Customer UI: 주문 확정 버튼 클릭
2. Axios: POST /api/orders (JWT + 주문 데이터)
3. Order Router: 요청 수신, Pydantic 검증
4. Order Service: 메뉴 검증 → 세션 확인 → 주문 저장
5. Table Session Service: 세션 없으면 자동 생성
6. Order Repository: DB 저장
7. SSE Service: 주문 이벤트 발행
8. Admin UI: SSE로 실시간 수신 → 대시보드 업데이트
9. Customer UI: 주문 성공 응답 → 주문 번호 표시
```

### 이용 완료 흐름
```
1. Admin UI: 이용 완료 버튼 클릭 → 확인 팝업
2. Axios: POST /api/admin/tables/{id}/complete (JWT)
3. Table Router: 요청 수신
4. Table Session Service: 세션 종료 → 주문 이력 이동 → 리셋
5. Order Repository: 주문 데이터 이력 테이블로 이동
6. SSE Service: 테이블 리셋 이벤트 발행
7. Admin UI: SSE로 수신 → 대시보드 업데이트
```

---

## 인증 흐름

### 관리자 인증
```
Admin UI → POST /api/admin/login → AuthService → JWT 발급 (16시간)
                                                      │
Admin UI ← 200 + JWT Token ←─────────────────────────┘
                                                      
이후 모든 요청: Authorization: Bearer {token}
```

### 테이블 태블릿 인증
```
Tablet → POST /api/table/login → AuthService → JWT 발급
                                                    │
Tablet ← 200 + JWT Token ←────────────────────────┘
                                                    
로컬 저장 → 자동 로그인 (만료 시 재인증)
```

---

## 에러 전파 패턴

```
Repository (DB 에러) → Service (비즈니스 예외 변환) → Router (HTTP 응답 변환)
                                                              │
                                                              ├── 400: 입력 검증 실패
                                                              ├── 401: 인증 실패
                                                              ├── 403: 권한 없음
                                                              ├── 404: 리소스 없음
                                                              └── 500: 내부 서버 에러 (상세 숨김)
```
