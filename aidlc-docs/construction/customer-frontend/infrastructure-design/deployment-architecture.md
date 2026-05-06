# Deployment Architecture - 테이블오더 서비스

## CI/CD 파이프라인

```
Developer Push → GitHub Actions → Build → Test → Deploy
```

### 파이프라인 단계

| 단계 | 동작 | 도구 |
|------|------|------|
| 1. Lint & Type Check | ESLint + TypeScript 검사 | GitHub Actions |
| 2. Unit Test | Vitest (프론트), pytest (백엔드) | GitHub Actions |
| 3. Build | Vite build (프론트), Docker build (백엔드) | GitHub Actions |
| 4. Push Image | ECR에 Docker 이미지 푸시 | GitHub Actions |
| 5. Deploy | ECS 서비스 업데이트, S3 업로드 | GitHub Actions |

---

## 배포 전략

### Frontend (S3 + CloudFront)
```
npm run build → dist/ 생성 → S3 업로드 → CloudFront 캐시 무효화
```

### Backend (ECS Fargate)
```
Docker build → ECR push → ECS Task Definition 업데이트 → Rolling Update
```

### Database Migration
```
ECS 태스크 실행 (1회성) → alembic upgrade head
```

---

## 환경 분리

| 환경 | 브랜치 | 배포 트리거 |
|------|--------|-------------|
| Development | feature/* | 수동 |
| Staging | develop | develop 머지 시 자동 |
| Production | main | main 머지 시 자동 (승인 필요) |

---

## 롤백 전략

| 컴포넌트 | 롤백 방법 |
|----------|-----------|
| Frontend | S3 이전 버전 복원 + CloudFront 무효화 |
| Backend | ECS 이전 Task Definition으로 롤백 |
| Database | RDS 스냅샷 복원 (최후 수단) |

---

## Docker Compose (로컬 개발용)

현재 `docker-compose.yml`로 로컬에서 전체 시스템 실행 가능:

```bash
# 전체 시스템 시작
docker-compose up --build

# DB 마이그레이션
docker-compose exec backend alembic upgrade head

# 시드 데이터 삽입
docker-compose exec backend python seed.py

# 프론트엔드 (별도 터미널)
cd frontend && npm run dev
```

접속:
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:8000
- API 문서: http://localhost:8000/docs (Swagger)
