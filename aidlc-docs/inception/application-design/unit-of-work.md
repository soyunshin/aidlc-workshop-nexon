# Unit of Work 정의 - 테이블오더 서비스

## 분해 전략

| 항목 | 선택 |
|------|------|
| **개발 순서** | 레이어별 (DB 스키마 → 백엔드 전체 → 프론트엔드 전체) |
| **의존성 관리** | 병렬 가능한 부분은 병렬로 |
| **테스트 전략** | 유닛별 단위 테스트 + 마지막에 통합 테스트 |
| **아키텍처** | 모놀리식 (단일 FastAPI + 단일 React 앱) |

---

## Unit 정의

### Unit 1: Database Schema & Core Infrastructure
| 항목 | 내용 |
|------|------|
| **이름** | database-core |
| **유형** | Foundation (기반) |
| **책임** | DB 스키마 정의, SQLAlchemy 모델, Alembic 마이그레이션, Core 모듈 (설정, DB 연결, 미들웨어, 에러 핸들링) |
| **산출물** | SQLAlchemy 모델, Alembic 마이그레이션, core 모듈, Docker Compose (MySQL) |
| **병렬 가능** | 아니오 (다른 모든 유닛의 기반) |
| **테스트** | 모델 단위 테스트, DB 연결 테스트 |

**코드 범위:**
- `backend/app/models/` - SQLAlchemy 모델 전체
- `backend/app/core/` - 설정, DB 세션, 미들웨어, 에러 핸들러
- `backend/alembic/` - 마이그레이션
- `docker-compose.yml` - MySQL 컨테이너

---

### Unit 2: Auth Backend
| 항목 | 내용 |
|------|------|
| **이름** | auth-backend |
| **유형** | Backend Module |
| **책임** | 인증/인가 API (관리자 로그인, 테이블 로그인, JWT, 브루트포스 방지) |
| **산출물** | auth 라우터, 서비스, 리포지토리, Pydantic 스키마 |
| **병렬 가능** | Unit 1 완료 후 시작. Unit 3, 4와 병렬 가능 |
| **테스트** | 단위 테스트 + PBT (JWT 토큰 라운드트립) |

**코드 범위:**
- `backend/app/auth/` - router, service, repository, schemas

---

### Unit 3: Menu Backend
| 항목 | 내용 |
|------|------|
| **이름** | menu-backend |
| **유형** | Backend Module |
| **책임** | 메뉴/카테고리 CRUD API |
| **산출물** | menu 라우터, 서비스, 리포지토리, Pydantic 스키마 |
| **병렬 가능** | Unit 1 완료 후 시작. Unit 2, 4와 병렬 가능 |
| **테스트** | 단위 테스트 + PBT (메뉴 순서 불변성) |

**코드 범위:**
- `backend/app/menu/` - router, service, repository, schemas

---

### Unit 4: Order & Table Backend
| 항목 | 내용 |
|------|------|
| **이름** | order-table-backend |
| **유형** | Backend Module |
| **책임** | 주문 생성/관리, 테이블 세션 관리, SSE 실시간 통신 |
| **산출물** | order 라우터/서비스/리포지토리, table 라우터/서비스/리포지토리, sse 모듈 |
| **병렬 가능** | Unit 1 완료 후 시작. Unit 2, 3과 병렬 가능 |
| **테스트** | 단위 테스트 + PBT (주문 금액 계산 불변성, 세션 상태 전이) |

**코드 범위:**
- `backend/app/order/` - router, service, repository, schemas
- `backend/app/table/` - router, service, repository, schemas
- `backend/app/sse/` - router, service

---

### Unit 5: Customer Frontend
| 항목 | 내용 |
|------|------|
| **이름** | customer-frontend |
| **유형** | Frontend Module |
| **책임** | 고객용 UI (메뉴 조회, 장바구니, 주문, 주문 내역) |
| **산출물** | 고객 페이지 컴포넌트, Context, API 클라이언트 |
| **병렬 가능** | Unit 2, 3, 4 완료 후 시작. Unit 6과 병렬 가능 |
| **테스트** | 컴포넌트 테스트 + PBT (장바구니 금액 계산) |

**코드 범위:**
- `frontend/src/pages/customer/` - 고객 페이지
- `frontend/src/contexts/` - CartContext, AuthContext
- `frontend/src/api/` - Axios 클라이언트 (공통)
- `frontend/src/components/` - 공통 UI 컴포넌트

---

### Unit 6: Admin Frontend
| 항목 | 내용 |
|------|------|
| **이름** | admin-frontend |
| **유형** | Frontend Module |
| **책임** | 관리자용 UI (로그인, 대시보드, 메뉴 관리, 테이블 관리) |
| **산출물** | 관리자 페이지 컴포넌트, SSE 연결, 관리 기능 |
| **병렬 가능** | Unit 2, 3, 4 완료 후 시작. Unit 5와 병렬 가능 |
| **테스트** | 컴포넌트 테스트 |

**코드 범위:**
- `frontend/src/pages/admin/` - 관리자 페이지
- `frontend/src/contexts/` - AdminAuthContext (공유)

---

### Unit 7: Integration & E2E Testing
| 항목 | 내용 |
|------|------|
| **이름** | integration-testing |
| **유형** | Testing |
| **책임** | 통합 테스트, E2E 시나리오 검증 |
| **산출물** | 통합 테스트 스위트, 테스트 시드 데이터 |
| **병렬 가능** | Unit 5, 6 완료 후 시작 |
| **테스트** | API 통합 테스트, 주문 플로우 E2E |

**코드 범위:**
- `backend/tests/integration/` - API 통합 테스트
- `backend/tests/conftest.py` - 테스트 픽스처

---

## 코드 조직 전략

```
table-order/                        # 모노레포 루트
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI 앱 진입점
│   │   ├── core/                  # Unit 1: 공통 인프라
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── security.py
│   │   │   ├── middleware.py
│   │   │   └── exceptions.py
│   │   ├── models/                # Unit 1: SQLAlchemy 모델
│   │   │   ├── __init__.py
│   │   │   ├── store.py
│   │   │   ├── admin.py
│   │   │   ├── table.py
│   │   │   ├── menu.py
│   │   │   └── order.py
│   │   ├── auth/                  # Unit 2
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   └── schemas.py
│   │   ├── menu/                  # Unit 3
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   └── schemas.py
│   │   ├── order/                 # Unit 4
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   └── schemas.py
│   │   ├── table/                 # Unit 4
│   │   │   ├── router.py
│   │   │   ├── service.py
│   │   │   ├── repository.py
│   │   │   └── schemas.py
│   │   └── sse/                   # Unit 4
│   │       ├── router.py
│   │       └── service.py
│   ├── tests/
│   │   ├── unit/                  # 유닛별 단위 테스트
│   │   ├── property/             # PBT 테스트
│   │   └── integration/          # Unit 7: 통합 테스트
│   ├── alembic/                   # Unit 1: 마이그레이션
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── pages/
│   │   │   ├── customer/         # Unit 5
│   │   │   └── admin/            # Unit 6
│   │   ├── components/           # Unit 5 (공통)
│   │   ├── contexts/             # Unit 5, 6 (공유)
│   │   ├── api/                  # Unit 5 (공통)
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
└── docker-compose.yml             # Unit 1
```

---

## 개발 순서 (실행 흐름)

```
Phase 1: Unit 1 (database-core)
    │
    ├── 완료 후 병렬 시작
    │
Phase 2: Unit 2 (auth) ║ Unit 3 (menu) ║ Unit 4 (order+table)
    │
    ├── 모두 완료 후 병렬 시작
    │
Phase 3: Unit 5 (customer-frontend) ║ Unit 6 (admin-frontend)
    │
    ├── 모두 완료 후
    │
Phase 4: Unit 7 (integration-testing)
```
