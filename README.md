# 테이블오더 서비스

디지털 주문 시스템을 통해 고객에게는 편리한 주문 경험을, 매장 운영자에게는 효율적인 운영 환경을 제공하는 테이블오더 플랫폼입니다.

## 기술 스택

| 영역 | 기술 |
|------|------|
| Backend | Python 3.12 + FastAPI |
| Frontend | React 18 + TypeScript + Vite |
| Database | SQLite (개발) / MySQL 8 (프로덕션) |
| 상태 관리 | React Context + useReducer |
| HTTP 클라이언트 | Axios |
| 테스트 | Vitest + fast-check (PBT) / pytest (백엔드) |

## 프로젝트 구조

```
table-order/
├── backend/           # FastAPI 백엔드
│   ├── app/
│   │   ├── auth/      # 인증 모듈
│   │   ├── menu/      # 메뉴 모듈
│   │   ├── order/     # 주문 모듈
│   │   ├── table/     # 테이블 모듈
│   │   ├── sse/       # 실시간 통신 (SSE)
│   │   ├── core/      # 공통 인프라
│   │   └── models/    # SQLAlchemy 모델
│   ├── tests/         # 백엔드 테스트
│   ├── seed.py        # 초기 데이터 (매장, 관리자)
│   └── seed_menu.py   # 메뉴 샘플 데이터
├── frontend/          # React 프론트엔드
│   └── src/
│       ├── pages/
│       │   ├── customer/  # 고객용 페이지
│       │   └── admin/     # 관리자용 페이지
│       ├── contexts/      # 상태 관리 (Auth, Cart)
│       ├── api/           # API 클라이언트
│       └── components/    # 공통 컴포넌트
├── aidlc-docs/        # AI-DLC 설계 문서
└── docker-compose.yml # Docker 환경 (MySQL 버전)
```

## 실행 방법

### 백엔드

```bash
cd backend
python -m pip install -r requirements.txt
python seed.py          # 매장 + 관리자 계정 생성
python seed_menu.py     # 샘플 메뉴 데이터 생성
python -m uvicorn app.main:app --reload --port 8000
```

API 문서: http://localhost:8000/docs

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
```

접속: http://localhost:3000

## 기본 계정 정보

| 용도 | 매장 식별자 | 사용자명/테이블번호 | 비밀번호 |
|------|-------------|---------------------|----------|
| 관리자 로그인 | store001 | admin | admin123 |
| 테이블 설정 | store001 | (관리자에서 생성) | (관리자에서 설정) |

## 주요 기능

### 고객용
- 테이블 태블릿 자동 로그인
- 카테고리별 메뉴 조회
- 장바구니 관리 (로컬 저장)
- 주문 생성 및 주문 내역 조회

### 관리자용
- 실시간 주문 모니터링 (SSE)
- 주문 상태 변경 (대기중 → 준비중 → 완료)
- 메뉴 CRUD 관리
- 테이블 세션 관리 (이용 완료 처리)

## 개발 방법론

이 프로젝트는 AI-DLC (AI-Driven Development Life Cycle) 워크플로우로 개발되었습니다.
설계 문서는 `aidlc-docs/` 폴더에서 확인할 수 있습니다.
