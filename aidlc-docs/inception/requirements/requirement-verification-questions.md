# 요구사항 확인 질문

아래 질문에 답변해 주세요. 각 질문의 [Answer]: 태그 뒤에 선택한 옵션의 알파벳을 입력해 주세요.
선택지 중 적합한 것이 없으면 마지막 옵션(Other)을 선택하고 설명을 추가해 주세요.

---

## Question 1
백엔드 기술 스택으로 어떤 것을 사용하시겠습니까?

A) Node.js + Express (JavaScript/TypeScript)
B) Node.js + NestJS (TypeScript)
C) Spring Boot (Java/Kotlin)
D) Python + FastAPI
E) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 2
프론트엔드 기술 스택으로 어떤 것을 사용하시겠습니까?

A) React (TypeScript)
B) Vue.js (TypeScript)
C) Next.js (React 기반 풀스택)
D) Svelte/SvelteKit
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
데이터베이스로 어떤 것을 사용하시겠습니까?

A) PostgreSQL
B) MySQL/MariaDB
C) MongoDB
D) SQLite (개발/소규모 매장용)
E) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4
프로젝트 구조를 어떻게 구성하시겠습니까?

A) 모노레포 (프론트엔드 + 백엔드를 하나의 저장소에서 관리)
B) 분리된 저장소 (프론트엔드와 백엔드를 별도 프로젝트로 관리)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
매장(Store)은 단일 매장만 지원하면 되나요, 아니면 다중 매장(멀티테넌트)을 지원해야 하나요?

A) 단일 매장 (하나의 매장만 운영)
B) 다중 매장 (여러 매장을 하나의 시스템에서 관리, 각 매장은 독립적으로 운영)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6
메뉴 이미지는 어떻게 관리하시겠습니까?

A) 외부 이미지 URL 직접 입력 (별도 이미지 호스팅 사용)
B) 서버에 직접 업로드 (로컬 파일 저장)
C) 클라우드 스토리지 업로드 (AWS S3, GCS 등)
D) 이미지 없이 텍스트만 사용 (MVP 단계)
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7
배포 환경은 어떻게 계획하고 계신가요?

A) 클라우드 (AWS, GCP, Azure)
B) 자체 서버 (On-premises)
C) Docker 컨테이너 기반 (Docker Compose 등)
D) 아직 미정 (로컬 개발 환경만 우선 구축)
E) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 8
관리자 계정은 어떻게 생성되나요?

A) 시스템 초기 설정 시 기본 관리자 계정 생성 (시드 데이터)
B) 별도의 슈퍼 관리자가 매장 관리자 계정을 생성
C) 자체 회원가입 후 관리자 승인
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 9
동시 접속 규모는 어느 정도를 예상하시나요?

A) 소규모 (테이블 10개 이하, 동시 주문 10건 미만)
B) 중규모 (테이블 10~50개, 동시 주문 50건 미만)
C) 대규모 (테이블 50개 이상, 동시 주문 100건 이상)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 10: Security Extensions
이 프로젝트에 보안 확장 규칙을 적용하시겠습니까?

A) Yes — 모든 보안 규칙을 블로킹 제약으로 적용 (프로덕션 수준 애플리케이션에 권장)
B) No — 보안 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 11: Property-Based Testing Extension
이 프로젝트에 속성 기반 테스팅(PBT) 규칙을 적용하시겠습니까?

A) Yes — 모든 PBT 규칙을 블로킹 제약으로 적용 (비즈니스 로직, 데이터 변환, 직렬화, 상태 관리 컴포넌트가 있는 프로젝트에 권장)
B) Partial — 순수 함수와 직렬화 라운드트립에만 PBT 규칙 적용 (알고리즘 복잡도가 제한적인 프로젝트에 적합)
C) No — PBT 규칙 건너뛰기 (단순 CRUD 애플리케이션, UI 전용 프로젝트, 비즈니스 로직이 거의 없는 통합 레이어에 적합)
D) Other (please describe after [Answer]: tag below)

[Answer]: A
