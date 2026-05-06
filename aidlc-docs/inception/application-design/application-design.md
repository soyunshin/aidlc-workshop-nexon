# 애플리케이션 설계 통합 문서 - 테이블오더 서비스

## 1. 설계 결정사항

| 항목 | 선택 | 근거 |
|------|------|------|
| 백엔드 구조 | 단일 FastAPI 앱 + Router 분리 | 소규모 프로젝트, 배포 단순화 |
| 프론트엔드 구조 | 단일 React 앱 + 라우팅 분리 | 공통 컴포넌트 재사용, 빌드 단순화 |
| 레이어 구조 | 3-Layer (Router → Service → Repository) | 관심사 분리, 테스트 용이성 |
| DB 접근 | SQLAlchemy ORM | 타입 안전성, 마이그레이션 지원 |
| 상태 관리 | React Context + useReducer | 외부 의존성 최소화, 소규모 적합 |
| API 통신 | Axios | 인터셉터, 에러 핸들링 편의 |

---

## 2. 시스템 아키텍처 개요

```
+------------------+     +------------------+
|  Customer UI     |     |  Admin UI        |
|  (React/TS)      |     |  (React/TS)      |
+--------+---------+     +--------+---------+
         |                         |
         |  HTTP REST              |  HTTP REST + SSE
         |                         |
+--------+-------------------------+---------+
|              FastAPI Backend               |
|                                           |
|  +-------+  +------+  +-------+  +-----+ |
|  | Auth  |  | Menu |  | Order |  |Table| |
|  |Router |  |Router|  |Router |  |Router| |
|  +---+---+  +--+---+  +---+---+  +--+--+ |
|      |         |           |         |    |
|  +---+---+  +--+---+  +---+---+  +--+--+ |
|  | Auth  |  | Menu |  | Order |  |Table| |
|  |Service|  |Service|  |Service|  |Svc  | |
|  +---+---+  +--+---+  +---+---+  +--+--+ |
|      |         |           |         |    |
|  +---+---+  +--+---+  +---+---+  +--+--+ |
|  | Auth  |  | Menu |  | Order |  |Table| |
|  | Repo  |  | Repo |  | Repo  |  |Repo | |
|  +---+---+  +--+---+  +---+---+  +--+--+ |
|      |         |           |         |    |
+------+---------+-----------+---------+----+
       |         |           |         |
+------+---------+-----------+---------+----+
|            MySQL / MariaDB                |
+-------------------------------------------+
```

---

## 3. 컴포넌트 요약

### 백엔드 (6개 모듈)
| 모듈 | 책임 |
|------|------|
| **auth** | 인증/인가 (JWT, bcrypt, 브루트포스 방지) |
| **menu** | 메뉴/카테고리 CRUD |
| **order** | 주문 생성/조회/상태 관리/삭제 |
| **table** | 테이블 설정, 세션 라이프사이클 |
| **sse** | Server-Sent Events 실시간 통신 |
| **core** | 공통 인프라 (DB, 설정, 미들웨어, 에러 핸들링) |

### 프론트엔드 (3개 영역)
| 영역 | 책임 |
|------|------|
| **customer** | 고객용 페이지 (메뉴, 장바구니, 주문) |
| **admin** | 관리자용 페이지 (대시보드, 메뉴 관리, 테이블 관리) |
| **shared** | 공통 컴포넌트, API 클라이언트, Context |

---

## 4. API 엔드포인트 요약

### 공개 API (인증 불필요)
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/admin/login` | 관리자 로그인 |
| POST | `/api/table/login` | 테이블 로그인 |

### 고객 API (테이블 JWT 필요)
| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/menu/categories` | 카테고리 조회 |
| GET | `/api/menu/items` | 메뉴 조회 |
| POST | `/api/orders` | 주문 생성 |
| GET | `/api/orders` | 주문 내역 조회 |

### 관리자 API (관리자 JWT 필요)
| 메서드 | 경로 | 설명 |
|--------|------|------|
| POST | `/api/admin/logout` | 로그아웃 |
| GET | `/api/admin/orders` | 전체 주문 조회 |
| PUT | `/api/admin/orders/{id}/status` | 주문 상태 변경 |
| DELETE | `/api/admin/orders/{id}` | 주문 삭제 |
| POST | `/api/admin/menu/items` | 메뉴 등록 |
| PUT | `/api/admin/menu/items/{id}` | 메뉴 수정 |
| DELETE | `/api/admin/menu/items/{id}` | 메뉴 삭제 |
| PUT | `/api/admin/menu/items/order` | 메뉴 순서 변경 |
| POST | `/api/admin/menu/categories` | 카테고리 등록 |
| PUT | `/api/admin/menu/categories/{id}` | 카테고리 수정 |
| DELETE | `/api/admin/menu/categories/{id}` | 카테고리 삭제 |
| POST | `/api/admin/tables` | 테이블 설정 |
| GET | `/api/admin/tables` | 테이블 목록 |
| POST | `/api/admin/tables/{id}/complete` | 이용 완료 |
| GET | `/api/admin/tables/{id}/history` | 과거 내역 |
| GET | `/api/admin/sse/orders` | SSE 주문 스트림 |

---

## 5. 통신 패턴

| 패턴 | 사용처 | 기술 |
|------|--------|------|
| REST API | 모든 CRUD 작업 | HTTP + JSON |
| SSE | 실시간 주문 알림 | text/event-stream |
| JWT Bearer | 인증 | Authorization 헤더 |
| Local Storage | 장바구니, 로그인 정보 | 브라우저 API |

---

## 6. 보안 설계

| 영역 | 구현 |
|------|------|
| 인증 | JWT (관리자 16시간, 테이블 16시간) |
| 비밀번호 | bcrypt 해싱 |
| 입력 검증 | Pydantic 모델 (자동 타입/범위 검증) |
| SQL 인젝션 방지 | SQLAlchemy ORM (파라미터화된 쿼리) |
| CORS | 명시적 오리진 허용 목록 |
| 보안 헤더 | CSP, HSTS, X-Content-Type-Options 등 |
| Rate Limiting | slowapi (로그인 엔드포인트) |
| 에러 핸들링 | 프로덕션에서 상세 정보 숨김 |

---

## 7. 프로젝트 디렉토리 구조 (예상)

```
table-order/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI 앱 진입점
│   │   ├── core/                # 설정, DB, 미들웨어
│   │   ├── auth/                # 인증 모듈
│   │   ├── menu/                # 메뉴 모듈
│   │   ├── order/               # 주문 모듈
│   │   ├── table/               # 테이블 모듈
│   │   ├── sse/                 # SSE 모듈
│   │   └── models/              # SQLAlchemy 모델
│   ├── tests/                   # 테스트
│   ├── alembic/                 # DB 마이그레이션
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── customer/        # 고객 페이지
│   │   │   └── admin/           # 관리자 페이지
│   │   ├── components/          # 공통 컴포넌트
│   │   ├── contexts/            # React Context
│   │   ├── api/                 # Axios 클라이언트
│   │   └── utils/               # 유틸리티
│   ├── package.json
│   └── tsconfig.json
└── docker-compose.yml
```

---

## 참조 문서
- [컴포넌트 정의](components.md)
- [메서드 시그니처](component-methods.md)
- [서비스 설계](services.md)
- [의존성 관계](component-dependency.md)
