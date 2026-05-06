# Logical Components - Unit 5: Customer Frontend

## 인프라 컴포넌트 맵

```
+--------------------------------------------------+
|                  React App                       |
|                                                  |
|  +--------------------------------------------+  |
|  |           Error Boundary (전역)            |  |
|  |                                            |  |
|  |  +--------------------------------------+  |  |
|  |  |        Auth Provider                 |  |  |
|  |  |  - JWT 토큰 관리                     |  |  |
|  |  |  - 자동 재인증                       |  |  |
|  |  |  - 로그인 상태                       |  |  |
|  |  +--------------------------------------+  |  |
|  |                                            |  |
|  |  +--------------------------------------+  |  |
|  |  |        Cart Provider                 |  |  |
|  |  |  - 장바구니 상태                     |  |  |
|  |  |  - localStorage 동기화              |  |  |
|  |  |  - 총액/수량 계산                    |  |  |
|  |  +--------------------------------------+  |  |
|  |                                            |  |
|  |  +--------------------------------------+  |  |
|  |  |        Axios Client                  |  |  |
|  |  |  - JWT 자동 첨부 (인터셉터)          |  |  |
|  |  |  - 401 자동 재인증 (인터셉터)        |  |  |
|  |  |  - 타임아웃 10초                     |  |  |
|  |  +--------------------------------------+  |  |
|  |                                            |  |
|  +--------------------------------------------+  |
|                                                  |
+--------------------------------------------------+
         |                    |
         v                    v
+------------------+  +------------------+
|   localStorage   |  |   Backend API    |
|  - auth_token    |  |   (port 8000)    |
|  - credentials   |  |                  |
|  - cart_items    |  |                  |
+------------------+  +------------------+
```

---

## 컴포넌트별 NFR 책임

### Error Boundary
| 항목 | 내용 |
|------|------|
| **NFR** | 신뢰성 (NFR-REL-04) |
| **책임** | 미처리 렌더링 에러 캐치, 앱 크래시 방지 |
| **동작** | 에러 발생 시 fallback UI 표시 |
| **SECURITY** | SECURITY-15 (글로벌 에러 핸들러) |

### Auth Provider
| 항목 | 내용 |
|------|------|
| **NFR** | 보안 (NFR-SEC-01), 신뢰성 (NFR-REL-03) |
| **책임** | JWT 라이프사이클 관리, 자동 재인증 |
| **동작** | 토큰 만료 감지 → 재인증 → 실패 시 /setup 이동 |
| **SECURITY** | SECURITY-08 (토큰 검증), SECURITY-12 (세션 관리) |

### Cart Provider
| 항목 | 내용 |
|------|------|
| **NFR** | 사용성 (NFR-UX-04), 성능 (NFR-PERF-03) |
| **책임** | 장바구니 상태 + localStorage 동기화 |
| **동작** | 즉시 UI 반영 (낙관적 업데이트), 새로고침 내구성 |
| **PBT** | 총액 불변성, 수량 불변성, 직렬화 라운드트립 |

### Axios Client (인터셉터)
| 항목 | 내용 |
|------|------|
| **NFR** | 보안 (NFR-SEC-03), 신뢰성 (NFR-REL-01, REL-03) |
| **책임** | HTTP 통신, 인증 헤더, 에러 처리 |
| **요청 인터셉터** | Authorization: Bearer {token} 자동 첨부 |
| **응답 인터셉터** | 401 → 재인증, 5xx → 재시도 (최대 2회) |
| **SECURITY** | SECURITY-08 (모든 요청에 토큰), SECURITY-15 (에러 핸들링) |

### localStorage
| 항목 | 내용 |
|------|------|
| **NFR** | 사용성 (NFR-UX-04), 보안 (NFR-SEC-01) |
| **저장 항목** | auth_token, credentials (store_id, table_number, password), cart_items |
| **보안 고려** | XSS 방지로 접근 차단, 민감 정보 최소화 |
| **SECURITY** | SECURITY-12 (credential 저장) |

---

## SECURITY 규칙 매핑 요약

| SECURITY 규칙 | 적용 컴포넌트 | 구현 방식 |
|---------------|---------------|-----------|
| SECURITY-04 | 서버/CDN | 보안 헤더 (CSP, HSTS, X-Content-Type-Options) |
| SECURITY-05 | Axios Client | Pydantic 서버 검증 + 클라이언트 폼 검증 |
| SECURITY-08 | Auth Provider + Axios | JWT 모든 요청 첨부, 401 처리 |
| SECURITY-09 | 빌드 설정 | 프로덕션 소스맵 제거, 에러 상세 숨김 |
| SECURITY-10 | package.json | 정확한 버전 고정, lock 파일 커밋 |
| SECURITY-12 | Auth Provider | 세션 만료, 재인증, credential 관리 |
| SECURITY-13 | index.html | 외부 CDN 스크립트 SRI 해시 (현재 없음) |
| SECURITY-15 | Error Boundary + Axios | 글로벌 에러 핸들러, fail-closed |
