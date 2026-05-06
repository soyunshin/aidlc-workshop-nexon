# 컴포넌트 정의 - 테이블오더 서비스

## 설계 결정사항 요약

| 항목 | 선택 |
|------|------|
| 백엔드 구조 | 단일 FastAPI 앱 + Router 분리 (모놀리식) |
| 프론트엔드 구조 | 단일 React 앱 + 라우팅 분리 |
| 레이어 구조 | 3-Layer (Router → Service → Repository) |
| DB 접근 | SQLAlchemy ORM |
| 상태 관리 | React Context + useReducer |
| API 통신 | Axios |

---

## 백엔드 컴포넌트

### BE-01: Auth Module
| 항목 | 내용 |
|------|------|
| **이름** | auth |
| **책임** | 인증/인가 처리 (관리자 로그인, 테이블 태블릿 인증, JWT 관리) |
| **레이어** | Router + Service + Repository |
| **주요 기능** | 관리자 로그인, 테이블 로그인, 토큰 발급/검증, 브루트포스 방지 |

### BE-02: Menu Module
| 항목 | 내용 |
|------|------|
| **이름** | menu |
| **책임** | 메뉴 및 카테고리 CRUD 관리 |
| **레이어** | Router + Service + Repository |
| **주요 기능** | 메뉴 조회, 등록, 수정, 삭제, 카테고리 관리, 노출 순서 조정 |

### BE-03: Order Module
| 항목 | 내용 |
|------|------|
| **이름** | order |
| **책임** | 주문 생성, 조회, 상태 관리, 삭제 |
| **레이어** | Router + Service + Repository |
| **주요 기능** | 주문 생성, 주문 목록 조회, 상태 변경, 주문 삭제, SSE 이벤트 발행 |

### BE-04: Table Module
| 항목 | 내용 |
|------|------|
| **이름** | table |
| **책임** | 테이블 관리, 세션 라이프사이클 |
| **레이어** | Router + Service + Repository |
| **주요 기능** | 테이블 설정, 세션 시작/종료, 이용 완료 처리, 과거 내역 조회 |

### BE-05: SSE Module
| 항목 | 내용 |
|------|------|
| **이름** | sse |
| **책임** | Server-Sent Events 실시간 통신 관리 |
| **레이어** | Router + Service |
| **주요 기능** | SSE 연결 관리, 주문 이벤트 브로드캐스트, 연결 상태 관리 |

### BE-06: Core Module
| 항목 | 내용 |
|------|------|
| **이름** | core |
| **책임** | 공통 인프라 (DB 연결, 설정, 미들웨어, 에러 핸들링) |
| **레이어** | Infrastructure |
| **주요 기능** | DB 세션 관리, 설정 로드, 보안 미들웨어, 글로벌 에러 핸들러, 로깅 |

---

## 프론트엔드 컴포넌트

### FE-01: Customer Pages
| 항목 | 내용 |
|------|------|
| **이름** | customer |
| **책임** | 고객용 UI (메뉴 조회, 장바구니, 주문) |
| **주요 페이지** | 메뉴 페이지, 장바구니, 주문 확인, 주문 내역 |

### FE-02: Admin Pages
| 항목 | 내용 |
|------|------|
| **이름** | admin |
| **책임** | 관리자용 UI (로그인, 대시보드, 메뉴 관리, 테이블 관리) |
| **주요 페이지** | 로그인, 주문 대시보드, 메뉴 관리, 테이블 관리 |

### FE-03: Shared Components
| 항목 | 내용 |
|------|------|
| **이름** | shared |
| **책임** | 공통 UI 컴포넌트, 유틸리티, API 클라이언트 |
| **주요 기능** | Axios 인스턴스, 인증 Context, 공통 UI 컴포넌트 |

---

## 데이터베이스 컴포넌트

### DB-01: Database Schema
| 항목 | 내용 |
|------|------|
| **이름** | database |
| **책임** | MySQL 스키마 정의, 마이그레이션 |
| **주요 테이블** | store, admin, tables, table_sessions, categories, menu_items, orders, order_items, order_history |
