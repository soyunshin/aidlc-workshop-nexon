# 서비스 레이어 설계 - 테이블오더 서비스

## 서비스 아키텍처 개요

3-Layer 아키텍처에서 Service Layer는 비즈니스 로직을 담당하며, Router(Controller)와 Repository 사이에서 오케스트레이션을 수행합니다.

```
Router (HTTP 요청/응답) → Service (비즈니스 로직) → Repository (데이터 접근)
```

---

## 서비스 정의

### AuthService
| 항목 | 내용 |
|------|------|
| **책임** | 인증/인가 비즈니스 로직 |
| **의존성** | AdminRepository, TableRepository, PasswordHasher, JWTManager |
| **오케스트레이션** | 자격 증명 검증 → 브루트포스 체크 → 토큰 발급 |

**주요 흐름:**
1. 관리자 로그인: 자격 증명 검증 → 시도 횟수 체크 → bcrypt 비교 → JWT 발급
2. 테이블 로그인: 매장/테이블 검증 → 비밀번호 확인 → JWT 발급
3. 토큰 검증: JWT 디코딩 → 만료 확인 → 페이로드 반환

---

### MenuService
| 항목 | 내용 |
|------|------|
| **책임** | 메뉴 관리 비즈니스 로직 |
| **의존성** | MenuRepository, CategoryRepository |
| **오케스트레이션** | 입력 검증 → 비즈니스 규칙 적용 → 데이터 저장 |

**주요 흐름:**
1. 메뉴 등록: 필수 필드 검증 → 가격 범위 검증 → 카테고리 존재 확인 → 저장
2. 메뉴 조회: 매장별 필터 → 카테고리별 그룹화 → 노출 순서 정렬
3. 순서 변경: 순서 값 검증 → 일괄 업데이트

---

### OrderService
| 항목 | 내용 |
|------|------|
| **책임** | 주문 생성 및 관리 비즈니스 로직 |
| **의존성** | OrderRepository, TableSessionService, SSEService, MenuRepository |
| **오케스트레이션** | 주문 검증 → 세션 확인 → 주문 저장 → SSE 이벤트 발행 |

**주요 흐름:**
1. 주문 생성: 메뉴 존재 확인 → 가격 검증 → 세션 확인/생성 → 주문 저장 → SSE 발행
2. 상태 변경: 주문 존재 확인 → 상태 전이 검증 → 업데이트 → SSE 발행
3. 주문 삭제: 주문 존재 확인 → 삭제 → 총액 재계산 → SSE 발행

---

### TableSessionService
| 항목 | 내용 |
|------|------|
| **책임** | 테이블 세션 라이프사이클 관리 |
| **의존성** | TableRepository, SessionRepository, OrderRepository, OrderHistoryRepository |
| **오케스트레이션** | 세션 상태 관리 → 주문 이력 이동 → 테이블 리셋 |

**주요 흐름:**
1. 세션 시작: 활성 세션 없음 확인 → 새 세션 생성 → 테이블에 세션 연결
2. 이용 완료: 세션 종료 → 주문을 이력으로 이동 → 테이블 리셋 → SSE 발행
3. 과거 내역: 테이블별 종료된 세션 조회 → 날짜 필터 적용

---

### SSEService
| 항목 | 내용 |
|------|------|
| **책임** | 실시간 이벤트 브로드캐스트 |
| **의존성** | 없음 (인메모리 이벤트 큐) |
| **오케스트레이션** | 연결 관리 → 이벤트 큐잉 → 브로드캐스트 |

**주요 흐름:**
1. 구독: 연결 등록 → AsyncGenerator 반환 → 이벤트 대기
2. 이벤트 발행: 이벤트 생성 → 매장별 구독자에게 브로드캐스트
3. 연결 해제: 연결 제거 → 리소스 정리

---

## 서비스 간 상호작용

```
OrderService ──→ TableSessionService (세션 확인/생성)
OrderService ──→ SSEService (주문 이벤트 발행)
OrderService ──→ MenuRepository (메뉴 가격 검증)

TableSessionService ──→ OrderRepository (주문 이력 이동)
TableSessionService ──→ SSEService (테이블 상태 이벤트)

AuthService ──→ (독립적, 다른 서비스에 의존하지 않음)
MenuService ──→ (독립적, 다른 서비스에 의존하지 않음)
```

---

## 횡단 관심사 (Cross-Cutting Concerns)

| 관심사 | 구현 방식 |
|--------|-----------|
| **인증** | JWT 미들웨어 (FastAPI Depends) |
| **입력 검증** | Pydantic 모델 (자동 검증) |
| **에러 핸들링** | 글로벌 예외 핸들러 + 커스텀 예외 클래스 |
| **로깅** | 구조화된 로깅 (structlog/logging) |
| **CORS** | FastAPI CORSMiddleware |
| **보안 헤더** | 커스텀 미들웨어 |
| **Rate Limiting** | slowapi 라이브러리 |
