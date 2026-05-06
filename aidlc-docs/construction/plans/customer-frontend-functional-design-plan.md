# Functional Design Plan - Unit 5: Customer Frontend

## 계획 개요

고객용 프론트엔드의 상세 기능 설계를 위한 계획입니다.
담당 스토리: US-01 (자동 로그인), US-02 (메뉴 조회), US-03 (장바구니), US-04 (주문 생성), US-05 (주문 내역)

---

## 질문 (Questions)

## Question 1
고객 UI의 전체 레이아웃 구조를 어떻게 구성하시겠습니까?

A) 하단 탭 네비게이션 (메뉴 | 장바구니 | 주문내역) - 모바일/태블릿 친화적
B) 상단 헤더 네비게이션 + 사이드 장바구니 드로어
C) 메뉴 화면 고정 + 하단 플로팅 장바구니 버튼 + 모달 방식 장바구니/주문내역
D) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2
장바구니 UI를 어떤 형태로 표시하시겠습니까?

A) 사이드 드로어 (오른쪽에서 슬라이드)
B) 하단 시트 (아래에서 올라오는 패널)
C) 별도 페이지 (/cart 경로)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
메뉴 카테고리 네비게이션을 어떻게 표시하시겠습니까?

A) 상단 가로 스크롤 탭 (카테고리명 나열)
B) 좌측 세로 사이드바 (카테고리 목록)
C) 상단 드롭다운 선택
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4
메뉴 카드 레이아웃을 어떻게 구성하시겠습니까?

A) 2열 그리드 (이미지 + 이름 + 가격, 컴팩트)
B) 1열 리스트 (좌측 이미지 + 우측 정보, 상세)
C) 2열 그리드 + 클릭 시 상세 모달
D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
주문 성공 후 리다이렉트 방식은 어떻게 하시겠습니까? (요구사항: 5초 후 메뉴 화면)

A) 별도 성공 페이지에서 카운트다운 표시 후 자동 이동
B) 모달/토스트로 주문 번호 표시 후 자동 닫힘
C) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## 설계 실행 계획

승인 후 아래 단계를 순서대로 실행합니다:

- [x] Step 1: 비즈니스 로직 모델 (business-logic-model.md)
- [x] Step 2: 비즈니스 규칙 (business-rules.md)
- [x] Step 3: 도메인 엔티티 (domain-entities.md)
- [x] Step 4: 프론트엔드 컴포넌트 설계 (frontend-components.md)

---

## 산출물 목록

| 파일 | 설명 |
|------|------|
| `aidlc-docs/construction/customer-frontend/functional-design/business-logic-model.md` | 비즈니스 로직 모델 |
| `aidlc-docs/construction/customer-frontend/functional-design/business-rules.md` | 비즈니스 규칙 |
| `aidlc-docs/construction/customer-frontend/functional-design/domain-entities.md` | 도메인 엔티티 |
| `aidlc-docs/construction/customer-frontend/functional-design/frontend-components.md` | 프론트엔드 컴포넌트 설계 |
