# Application Design Plan - 테이블오더 서비스

## 계획 개요

이 문서는 테이블오더 서비스의 애플리케이션 설계를 위한 계획입니다.
아래 질문에 답변 후, 승인하시면 설계 산출물을 생성합니다.

---

## 질문 (Questions)

### 컴포넌트 구조

## Question 1
백엔드 API 구조를 어떻게 구성하시겠습니까?

A) 단일 FastAPI 앱에 라우터(Router)로 기능 분리 (모놀리식)
B) 도메인별 별도 서비스 모듈로 분리하되 단일 앱에서 실행 (모듈러 모놀리스)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
프론트엔드 앱 구조를 어떻게 구성하시겠습니까?

A) 단일 React 앱에서 고객용/관리자용을 라우팅으로 분리
B) 고객용 앱과 관리자용 앱을 별도 React 앱으로 분리
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
백엔드 레이어 구조(계층)를 어떻게 구성하시겠습니까?

A) 3-Layer (Router → Service → Repository)
B) Clean Architecture (Router → UseCase → Repository, Domain 분리)
C) 2-Layer 간소화 (Router → Repository, 단순 CRUD 위주)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4
데이터베이스 접근 방식으로 어떤 것을 사용하시겠습니까?

A) SQLAlchemy ORM (풀 ORM, 모델 매핑)
B) SQLAlchemy Core (SQL 표현식 빌더, 경량)
C) 순수 SQL + aiomysql (직접 쿼리 작성)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
프론트엔드 상태 관리 방식으로 어떤 것을 사용하시겠습니까?

A) React Context + useReducer (내장 기능만 사용)
B) Zustand (경량 상태 관리 라이브러리)
C) Redux Toolkit (표준 상태 관리)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6
API 통신 라이브러리로 어떤 것을 사용하시겠습니까?

A) Axios (인터셉터, 에러 핸들링 편의)
B) Fetch API (내장 API, 추가 의존성 없음)
C) TanStack Query (React Query) + Axios (서버 상태 관리 + HTTP 클라이언트)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 설계 실행 계획

승인 후 아래 단계를 순서대로 실행합니다:

- [x] Step 1: 컴포넌트 식별 및 책임 정의 (components.md)
- [x] Step 2: 컴포넌트 메서드 시그니처 정의 (component-methods.md)
- [x] Step 3: 서비스 레이어 설계 (services.md)
- [x] Step 4: 컴포넌트 의존성 및 통신 패턴 (component-dependency.md)
- [x] Step 5: 통합 설계 문서 (application-design.md)

---

## 산출물 목록

| 파일 | 설명 |
|------|------|
| `aidlc-docs/inception/application-design/components.md` | 컴포넌트 정의 및 책임 |
| `aidlc-docs/inception/application-design/component-methods.md` | 메서드 시그니처 |
| `aidlc-docs/inception/application-design/services.md` | 서비스 정의 및 오케스트레이션 |
| `aidlc-docs/inception/application-design/component-dependency.md` | 의존성 관계 및 통신 패턴 |
| `aidlc-docs/inception/application-design/application-design.md` | 통합 설계 문서 |
