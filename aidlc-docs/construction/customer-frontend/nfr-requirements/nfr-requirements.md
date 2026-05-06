# NFR Requirements - Unit 5: Customer Frontend

## 성능 요구사항

| ID | 요구사항 | 목표값 | 측정 방법 |
|----|----------|--------|-----------|
| NFR-PERF-01 | 초기 페이지 로드 시간 | 3초 이내 (LCP) | Lighthouse |
| NFR-PERF-02 | 메뉴 카테고리 전환 응답 | 100ms 이내 | 클라이언트 측 필터링 |
| NFR-PERF-03 | 장바구니 조작 응답 | 즉시 (16ms 이내) | 상태 업데이트 |
| NFR-PERF-04 | API 호출 타임아웃 | 10초 | Axios timeout 설정 |
| NFR-PERF-05 | 번들 사이즈 | 500KB 이하 (gzip) | 빌드 분석 |

## 사용성/접근성 요구사항

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| NFR-UX-01 | 터치 타겟 최소 44x44px | CSS min-width/min-height |
| NFR-UX-02 | 로딩 상태 피드백 | 스켈레톤 UI / 스피너 |
| NFR-UX-03 | 에러 상태 피드백 | 사용자 친화적 메시지 + 재시도 버튼 |
| NFR-UX-04 | 오프라인 장바구니 | localStorage 동기화 |
| NFR-UX-05 | 반응형 레이아웃 | 태블릿 최적화 (768px~1024px) |

## 보안 요구사항 (SECURITY 규칙 준수)

| ID | 요구사항 | SECURITY 규칙 |
|----|----------|---------------|
| NFR-SEC-01 | JWT 토큰을 메모리/localStorage에만 저장 (httpOnly 쿠키 불가 - SPA) | SECURITY-12 |
| NFR-SEC-02 | XSS 방지: 사용자 입력 이스케이프, dangerouslySetInnerHTML 금지 | SECURITY-05 |
| NFR-SEC-03 | HTTPS 전용 통신 | SECURITY-01 |
| NFR-SEC-04 | 민감 정보 콘솔 로그 금지 (토큰, 비밀번호) | SECURITY-03 |
| NFR-SEC-05 | 외부 CDN 리소스 SRI 해시 적용 | SECURITY-13 |

## 신뢰성 요구사항

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| NFR-REL-01 | API 실패 시 graceful degradation | 에러 바운더리 + 재시도 |
| NFR-REL-02 | 네트워크 끊김 시 장바구니 유지 | localStorage 기반 |
| NFR-REL-03 | 401 응답 시 자동 재인증 | Axios 인터셉터 |
| NFR-REL-04 | 글로벌 에러 핸들링 | React Error Boundary |

## 유지보수성 요구사항

| ID | 요구사항 | 구현 방법 |
|----|----------|-----------|
| NFR-MAINT-01 | TypeScript strict 모드 | tsconfig.json strict: true |
| NFR-MAINT-02 | ESLint + Prettier 코드 포맷팅 | 설정 파일 |
| NFR-MAINT-03 | 컴포넌트 단위 테스트 | Vitest + React Testing Library |
| NFR-MAINT-04 | PBT 프레임워크 | fast-check |
