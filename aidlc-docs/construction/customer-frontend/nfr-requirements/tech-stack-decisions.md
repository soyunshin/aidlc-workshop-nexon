# Tech Stack Decisions - Unit 5: Customer Frontend

## 핵심 기술 스택

| 영역 | 기술 | 버전 | 근거 |
|------|------|------|------|
| **언어** | TypeScript | 5.x | 타입 안전성, 개발 생산성 |
| **프레임워크** | React | 18.x | 요구사항 결정, 생태계 |
| **빌드 도구** | Vite | 5.x | 빠른 HMR, 최적화된 빌드 |
| **상태 관리** | React Context + useReducer | 내장 | 외부 의존성 최소화 |
| **HTTP 클라이언트** | Axios | 1.x | 인터셉터, 에러 핸들링 |
| **라우팅** | React Router | 6.x | SPA 라우팅 표준 |
| **스타일링** | CSS Modules 또는 Tailwind CSS | - | 컴포넌트 스코프 스타일 |

## 테스트 스택

| 영역 | 기술 | 근거 |
|------|------|------|
| **테스트 러너** | Vitest | Vite 네이티브 통합, Jest 호환 API |
| **컴포넌트 테스트** | React Testing Library | 사용자 관점 테스트 |
| **PBT 프레임워크** | fast-check | PBT-09 준수, Vitest 통합 |
| **E2E (선택)** | Playwright | 크로스 브라우저 테스트 |

## 개발 도구

| 도구 | 용도 |
|------|------|
| ESLint | 코드 품질 검사 |
| Prettier | 코드 포맷팅 |
| TypeScript strict mode | 타입 안전성 강화 |

## 의존성 목록 (예상)

### dependencies
```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.0"
}
```

### devDependencies
```json
{
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",
  "@vitejs/plugin-react": "^4.2.0",
  "typescript": "^5.4.0",
  "vite": "^5.4.0",
  "vitest": "^1.6.0",
  "@testing-library/react": "^14.2.0",
  "@testing-library/jest-dom": "^6.4.0",
  "fast-check": "^3.15.0",
  "eslint": "^8.57.0",
  "prettier": "^3.2.0"
}
```

## PBT 프레임워크 설정 (PBT-09 준수)

| 항목 | 설정 |
|------|------|
| 프레임워크 | fast-check 3.x |
| 테스트 러너 통합 | Vitest (describe/it/expect) |
| 커스텀 생성기 | 지원 (fc.record, fc.array 등) |
| 자동 축소 | 지원 (기본 활성화) |
| 시드 기반 재현 | 지원 (실패 시 시드 출력) |
| CI 통합 | Vitest 실행 시 자동 포함 |

## SECURITY 규칙 준수 매핑

| SECURITY 규칙 | 프론트엔드 적용 |
|---------------|----------------|
| SECURITY-04 | CSP, HSTS 등 보안 헤더 (서버/CDN에서 설정) |
| SECURITY-05 | Pydantic 서버 검증 + 클라이언트 폼 검증 |
| SECURITY-08 | JWT 토큰 모든 요청에 포함, 401 처리 |
| SECURITY-09 | 프로덕션 빌드에서 소스맵 제거, 에러 상세 숨김 |
| SECURITY-10 | package-lock.json 커밋, 정확한 버전 고정 |
| SECURITY-13 | 외부 CDN 스크립트 SRI 해시 |
| SECURITY-15 | Error Boundary로 미처리 에러 캐치 |
