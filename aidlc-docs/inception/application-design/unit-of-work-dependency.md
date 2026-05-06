# Unit of Work 의존성 매트릭스 - 테이블오더 서비스

## 의존성 매트릭스

| Unit | 의존 대상 | 의존 유형 | 병렬 가능 대상 |
|------|-----------|-----------|----------------|
| Unit 1: database-core | 없음 (기반) | - | - |
| Unit 2: auth-backend | Unit 1 | 빌드 의존 | Unit 3, Unit 4 |
| Unit 3: menu-backend | Unit 1 | 빌드 의존 | Unit 2, Unit 4 |
| Unit 4: order-table-backend | Unit 1 | 빌드 의존 | Unit 2, Unit 3 |
| Unit 5: customer-frontend | Unit 2, 3, 4 | API 계약 의존 | Unit 6 |
| Unit 6: admin-frontend | Unit 2, 3, 4 | API 계약 의존 | Unit 5 |
| Unit 7: integration-testing | Unit 5, 6 | 전체 의존 | - |

---

## 의존성 다이어그램

```
Unit 1 (database-core)
  │
  ├──→ Unit 2 (auth-backend)      ─┐
  ├──→ Unit 3 (menu-backend)       ├──→ Unit 5 (customer-frontend) ─┐
  └──→ Unit 4 (order-table-backend)├──→ Unit 6 (admin-frontend)    ├──→ Unit 7 (integration)
                                   ─┘                               ─┘
```

---

## Phase별 실행 계획

### Phase 1: Foundation (순차)
| Unit | 예상 기간 | 선행 조건 |
|------|-----------|-----------|
| Unit 1: database-core | - | 없음 |

### Phase 2: Backend Modules (병렬)
| Unit | 예상 기간 | 선행 조건 |
|------|-----------|-----------|
| Unit 2: auth-backend | - | Unit 1 완료 |
| Unit 3: menu-backend | - | Unit 1 완료 |
| Unit 4: order-table-backend | - | Unit 1 완료 |

### Phase 3: Frontend (병렬)
| Unit | 예상 기간 | 선행 조건 |
|------|-----------|-----------|
| Unit 5: customer-frontend | - | Unit 2, 3, 4 완료 |
| Unit 6: admin-frontend | - | Unit 2, 3, 4 완료 |

### Phase 4: Integration (순차)
| Unit | 예상 기간 | 선행 조건 |
|------|-----------|-----------|
| Unit 7: integration-testing | - | Unit 5, 6 완료 |

---

## 공유 리소스

| 리소스 | 사용 유닛 | 관리 방식 |
|--------|-----------|-----------|
| SQLAlchemy 모델 | Unit 1 (정의), Unit 2-4 (사용) | Unit 1에서 정의, 다른 유닛에서 import |
| Pydantic 스키마 | Unit 2-4 (각자 정의) | 각 모듈 내 schemas.py |
| Core 설정/미들웨어 | Unit 1 (정의), 전체 (사용) | core/ 모듈에서 중앙 관리 |
| Axios 인스턴스 | Unit 5 (정의), Unit 6 (사용) | frontend/src/api/ 공유 |
| React Context | Unit 5 (정의), Unit 6 (공유) | frontend/src/contexts/ 공유 |

---

## 통신 계약 (API Contract)

프론트엔드 유닛(5, 6)은 백엔드 유닛(2, 3, 4)의 API 명세에 의존합니다.
백엔드 유닛 완료 시 API 명세가 확정되므로, 프론트엔드는 이를 기반으로 개발합니다.

| 프론트엔드 유닛 | 사용하는 백엔드 API |
|----------------|---------------------|
| Unit 5 (customer) | Auth (테이블 로그인), Menu (조회), Order (생성/조회) |
| Unit 6 (admin) | Auth (관리자 로그인), Menu (CRUD), Order (관리), Table (관리), SSE |
