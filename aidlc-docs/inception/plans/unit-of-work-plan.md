# Unit of Work Plan - 테이블오더 서비스

## 계획 개요

이 문서는 테이블오더 서비스를 개발 가능한 작업 단위(Unit of Work)로 분해하기 위한 계획입니다.
아래 질문에 답변 후, 승인하시면 유닛 산출물을 생성합니다.

---

## 질문 (Questions)

## Question 1
모놀리식 구조에서 개발 순서를 어떻게 구성하시겠습니까?

A) 백엔드 전체 → 프론트엔드 전체 (백엔드 API 완성 후 프론트엔드 개발)
B) 기능 단위 수직 슬라이스 (인증 백엔드+프론트 → 메뉴 백엔드+프론트 → 주문 백엔드+프론트)
C) 레이어별 (DB 스키마 → 백엔드 전체 → 프론트엔드 전체)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2
유닛 간 의존성 관리를 어떻게 하시겠습니까?

A) 순차적 (앞 유닛 완료 후 다음 유닛 시작)
B) 병렬 가능한 부분은 병렬로 (독립적인 유닛은 동시 개발)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 3
테스트 전략을 유닛별로 어떻게 적용하시겠습니까?

A) 각 유닛 완료 시 해당 유닛의 단위 테스트 작성 (유닛별 독립 테스트)
B) 모든 유닛 완료 후 통합 테스트 일괄 작성
C) 유닛별 단위 테스트 + 마지막에 통합 테스트 (둘 다)
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## 유닛 생성 실행 계획

승인 후 아래 단계를 순서대로 실행합니다:

- [x] Step 1: 유닛 정의 및 책임 (unit-of-work.md)
- [x] Step 2: 유닛 간 의존성 매트릭스 (unit-of-work-dependency.md)
- [x] Step 3: 사용자 스토리 매핑 (unit-of-work-story-map.md)
- [x] Step 4: 유닛 경계 및 의존성 검증

---

## 산출물 목록

| 파일 | 설명 |
|------|------|
| `aidlc-docs/inception/application-design/unit-of-work.md` | 유닛 정의 및 책임 |
| `aidlc-docs/inception/application-design/unit-of-work-dependency.md` | 의존성 매트릭스 |
| `aidlc-docs/inception/application-design/unit-of-work-story-map.md` | 스토리-유닛 매핑 |
