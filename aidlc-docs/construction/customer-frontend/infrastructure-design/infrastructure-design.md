# Infrastructure Design - 테이블오더 서비스 (전체 시스템)

## 배포 환경 개요

| 환경 | 용도 | 구성 |
|------|------|------|
| **로컬 개발** | 개발/테스트 | Docker Compose (MySQL + Backend + Frontend) |
| **프로덕션** | 실제 서비스 | AWS 클라우드 |

---

## 로컬 개발 환경 (Docker Compose)

```
+--------------------------------------------------+
|              Docker Compose                      |
|                                                  |
|  +-------------+  +-------------+  +---------+  |
|  |   MySQL 8   |  |  FastAPI    |  | Vite    |  |
|  |  port:3306  |  |  port:8000  |  | port:3000| |
|  |             |  |             |  |         |  |
|  | table_order |  | /api/*      |  | React   |  |
|  +-------------+  +-------------+  +---------+  |
|        |                |                |       |
|        +--- 내부 네트워크 (docker network) ---+  |
+--------------------------------------------------+
```

### 서비스 구성

| 서비스 | 이미지 | 포트 | 역할 |
|--------|--------|------|------|
| db | mysql:8.0 | 3306 | 데이터베이스 |
| backend | Dockerfile (Python 3.12) | 8000 | API 서버 |
| frontend | Node 20 (dev server) | 3000 | React 개발 서버 |

---

## 프로덕션 환경 (AWS)

### 아키텍처 다이어그램

```
+--------------------------------------------------+
|                    AWS Cloud                      |
|                                                  |
|  +--------------------------------------------+  |
|  |              CloudFront (CDN)              |  |
|  |  - React 정적 파일 배포                    |  |
|  |  - HTTPS 종단                              |  |
|  |  - 보안 헤더 (CSP, HSTS)                   |  |
|  +--------------------------------------------+  |
|        |                                         |
|  +--------------------------------------------+  |
|  |           Application Load Balancer        |  |
|  |  - /api/* 라우팅                           |  |
|  |  - Health Check                            |  |
|  |  - Access Logging                          |  |
|  +--------------------------------------------+  |
|        |                                         |
|  +--------------------------------------------+  |
|  |           ECS Fargate (Backend)            |  |
|  |  - FastAPI 컨테이너                        |  |
|  |  - Auto Scaling (CPU 70%)                  |  |
|  |  - 최소 1, 최대 3 태스크                   |  |
|  +--------------------------------------------+  |
|        |                                         |
|  +--------------------------------------------+  |
|  |           RDS MySQL 8.0                    |  |
|  |  - db.t3.micro (소규모)                    |  |
|  |  - 암호화 at rest (KMS)                    |  |
|  |  - TLS 연결 강제                           |  |
|  |  - 자동 백업 7일                           |  |
|  +--------------------------------------------+  |
|                                                  |
+--------------------------------------------------+
```

---

## 인프라 서비스 매핑

### Compute

| 논리 컴포넌트 | AWS 서비스 | 사양 | 근거 |
|---------------|-----------|------|------|
| Backend API | ECS Fargate | 0.25 vCPU, 512MB | 소규모 트래픽, 서버리스 관리 |
| Frontend Static | S3 + CloudFront | - | 정적 파일, 글로벌 CDN |

### Storage

| 논리 컴포넌트 | AWS 서비스 | 사양 | 근거 |
|---------------|-----------|------|------|
| Database | RDS MySQL 8.0 | db.t3.micro, 20GB | 소규모, 관리형 |
| Static Assets | S3 | Standard | React 빌드 파일 |

### Networking

| 논리 컴포넌트 | AWS 서비스 | 설정 |
|---------------|-----------|------|
| Load Balancer | ALB | /api/* → ECS, /* → S3/CloudFront |
| DNS | Route 53 | 커스텀 도메인 (선택) |
| CDN | CloudFront | S3 오리진, HTTPS 전용 |
| VPC | VPC | Public/Private 서브넷 분리 |

### Security

| 논리 컴포넌트 | AWS 서비스 | 설정 |
|---------------|-----------|------|
| Secrets | Secrets Manager | DB 비밀번호, JWT Secret |
| Encryption | KMS | RDS 암호화 키 |
| Network | Security Groups | ALB→ECS(8000), ECS→RDS(3306) |
| WAF | AWS WAF (선택) | Rate Limiting, SQL Injection 방지 |

### Monitoring

| 논리 컴포넌트 | AWS 서비스 | 설정 |
|---------------|-----------|------|
| Logs | CloudWatch Logs | 90일 보존, 구조화된 JSON |
| Metrics | CloudWatch Metrics | CPU, 메모리, 요청 수 |
| Alerts | CloudWatch Alarms | 5xx 에러율, CPU > 80% |
| Tracing | X-Ray (선택) | 요청 추적 |

---

## SECURITY 규칙 인프라 매핑

| SECURITY 규칙 | 인프라 구현 |
|---------------|-------------|
| SECURITY-01 | RDS 암호화 at rest (KMS), TLS 연결 강제 |
| SECURITY-02 | ALB Access Logs → S3, CloudWatch Logs |
| SECURITY-03 | ECS → CloudWatch Logs (구조화된 JSON) |
| SECURITY-04 | CloudFront Response Headers Policy |
| SECURITY-06 | IAM 최소 권한 (ECS Task Role) |
| SECURITY-07 | Security Groups deny-by-default, Private 서브넷 |
| SECURITY-09 | Secrets Manager (no hardcoded credentials) |
| SECURITY-10 | ECR 이미지 스캔, 고정 태그 |
| SECURITY-14 | CloudWatch Alarms (인증 실패, 5xx) |

---

## 비용 추정 (소규모, 월간)

| 서비스 | 예상 비용 |
|--------|-----------|
| ECS Fargate (1 task) | ~$15 |
| RDS db.t3.micro | ~$15 |
| ALB | ~$20 |
| CloudFront + S3 | ~$5 |
| CloudWatch | ~$5 |
| **합계** | **~$60/월** |
