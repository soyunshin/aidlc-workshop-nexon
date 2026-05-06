# 컴포넌트 메서드 시그니처 - 테이블오더 서비스

## BE-01: Auth Module

### Router Layer
| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/api/admin/login` | 관리자 로그인 |
| `POST` | `/api/table/login` | 테이블 태블릿 로그인 |
| `POST` | `/api/admin/logout` | 관리자 로그아웃 |

### Service Layer
| 메서드 | 입력 | 출력 | 설명 |
|--------|------|------|------|
| `authenticate_admin` | store_id, username, password | AdminToken | 관리자 인증 및 JWT 발급 |
| `authenticate_table` | store_id, table_number, password | TableToken | 테이블 인증 및 JWT 발급 |
| `verify_token` | token: str | TokenPayload | JWT 검증 |
| `check_login_attempts` | identifier: str | bool | 브루트포스 체크 |

### Repository Layer
| 메서드 | 입력 | 출력 | 설명 |
|--------|------|------|------|
| `get_admin_by_credentials` | store_id, username | Admin | None | 관리자 조회 |
| `get_table_by_credentials` | store_id, table_number | Table | None | 테이블 조회 |
| `record_login_attempt` | identifier, success | None | 로그인 시도 기록 |

---

## BE-02: Menu Module

### Router Layer
| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/api/menu/categories` | 카테고리 목록 조회 |
| `GET` | `/api/menu/items` | 메뉴 목록 조회 (카테고리별 필터) |
| `POST` | `/api/admin/menu/items` | 메뉴 등록 |
| `PUT` | `/api/admin/menu/items/{id}` | 메뉴 수정 |
| `DELETE` | `/api/admin/menu/items/{id}` | 메뉴 삭제 |
| `PUT` | `/api/admin/menu/items/order` | 메뉴 노출 순서 변경 |
| `POST` | `/api/admin/menu/categories` | 카테고리 등록 |
| `PUT` | `/api/admin/menu/categories/{id}` | 카테고리 수정 |
| `DELETE` | `/api/admin/menu/categories/{id}` | 카테고리 삭제 |

### Service Layer
| 메서드 | 입력 | 출력 | 설명 |
|--------|------|------|------|
| `get_categories` | store_id | List[Category] | 카테고리 목록 |
| `get_menu_items` | store_id, category_id? | List[MenuItem] | 메뉴 목록 |
| `create_menu_item` | MenuItemCreate | MenuItem | 메뉴 등록 |
| `update_menu_item` | item_id, MenuItemUpdate | MenuItem | 메뉴 수정 |
| `delete_menu_item` | item_id | None | 메뉴 삭제 |
| `update_menu_order` | List[ItemOrder] | None | 순서 변경 |

### Repository Layer
| 메서드 | 입력 | 출력 | 설명 |
|--------|------|------|------|
| `find_categories_by_store` | store_id | List[Category] | 카테고리 조회 |
| `find_menu_items` | store_id, category_id? | List[MenuItem] | 메뉴 조회 |
| `create_item` | MenuItem | MenuItem | 메뉴 생성 |
| `update_item` | item_id, data | MenuItem | 메뉴 업데이트 |
| `delete_item` | item_id | None | 메뉴 삭제 |

---

## BE-03: Order Module

### Router Layer
| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/api/orders` | 주문 생성 (고객) |
| `GET` | `/api/orders` | 주문 목록 조회 (테이블 세션별) |
| `GET` | `/api/admin/orders` | 전체 주문 조회 (관리자) |
| `PUT` | `/api/admin/orders/{id}/status` | 주문 상태 변경 |
| `DELETE` | `/api/admin/orders/{id}` | 주문 삭제 |

### Service Layer
| 메서드 | 입력 | 출력 | 설명 |
|--------|------|------|------|
| `create_order` | OrderCreate, table_id, session_id | Order | 주문 생성 |
| `get_orders_by_session` | session_id | List[Order] | 세션별 주문 조회 |
| `get_active_orders` | store_id | List[Order] | 활성 주문 조회 |
| `update_order_status` | order_id, status | Order | 상태 변경 |
| `delete_order` | order_id | None | 주문 삭제 |
| `calculate_table_total` | session_id | int | 테이블 총 주문액 계산 |

### Repository Layer
| 메서드 | 입력 | 출력 | 설명 |
|--------|------|------|------|
| `create_order` | Order | Order | 주문 저장 |
| `find_orders_by_session` | session_id | List[Order] | 세션별 조회 |
| `find_active_orders` | store_id | List[Order] | 활성 주문 조회 |
| `update_status` | order_id, status | Order | 상태 업데이트 |
| `delete_order` | order_id | None | 주문 삭제 |

---

## BE-04: Table Module

### Router Layer
| 메서드 | 경로 | 설명 |
|--------|------|------|
| `POST` | `/api/admin/tables` | 테이블 초기 설정 |
| `GET` | `/api/admin/tables` | 테이블 목록 조회 |
| `POST` | `/api/admin/tables/{id}/complete` | 이용 완료 처리 |
| `GET` | `/api/admin/tables/{id}/history` | 과거 주문 내역 조회 |

### Service Layer
| 메서드 | 입력 | 출력 | 설명 |
|--------|------|------|------|
| `setup_table` | TableSetup | Table | 테이블 초기 설정 |
| `get_tables` | store_id | List[Table] | 테이블 목록 |
| `start_session` | table_id | TableSession | 세션 시작 (첫 주문 시) |
| `complete_session` | table_id | None | 이용 완료 (세션 종료) |
| `get_order_history` | table_id, date_filter? | List[OrderHistory] | 과거 내역 |
| `move_orders_to_history` | session_id | None | 주문을 이력으로 이동 |

### Repository Layer
| 메서드 | 입력 | 출력 | 설명 |
|--------|------|------|------|
| `create_table` | Table | Table | 테이블 생성 |
| `find_tables_by_store` | store_id | List[Table] | 테이블 조회 |
| `create_session` | TableSession | TableSession | 세션 생성 |
| `close_session` | session_id | None | 세션 종료 |
| `create_order_history` | List[OrderHistory] | None | 이력 저장 |
| `find_history` | table_id, date_filter? | List[OrderHistory] | 이력 조회 |

---

## BE-05: SSE Module

### Router Layer
| 메서드 | 경로 | 설명 |
|--------|------|------|
| `GET` | `/api/admin/sse/orders` | SSE 주문 스트림 (관리자) |

### Service Layer
| 메서드 | 입력 | 출력 | 설명 |
|--------|------|------|------|
| `subscribe` | store_id | AsyncGenerator[Event] | SSE 구독 |
| `publish_order_event` | store_id, event_type, data | None | 이벤트 발행 |
| `unsubscribe` | connection_id | None | 구독 해제 |

---

## FE-01: Customer Pages

| 페이지 | 경로 | 주요 기능 |
|--------|------|-----------|
| MenuPage | `/` | 카테고리별 메뉴 조회, 장바구니 추가 |
| CartDrawer | (컴포넌트) | 장바구니 표시, 수량 조절, 총액 계산 |
| OrderConfirmPage | `/order/confirm` | 주문 최종 확인, 주문 확정 |
| OrderSuccessPage | `/order/success` | 주문 번호 표시, 5초 후 리다이렉트 |
| OrderHistoryPage | `/orders` | 현재 세션 주문 내역 조회 |

## FE-02: Admin Pages

| 페이지 | 경로 | 주요 기능 |
|--------|------|-----------|
| LoginPage | `/admin/login` | 관리자 로그인 |
| DashboardPage | `/admin/dashboard` | 실시간 주문 모니터링 (SSE) |
| MenuManagePage | `/admin/menu` | 메뉴 CRUD, 순서 조정 |
| TableManagePage | `/admin/tables` | 테이블 설정, 이용 완료, 과거 내역 |
