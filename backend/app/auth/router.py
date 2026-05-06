"""Auth router - authentication API endpoints."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.repository import AuthRepository
from app.auth.schemas import (
    AdminLoginRequest,
    MessageResponse,
    TableLoginRequest,
    TokenResponse,
)
from app.auth.service import AuthService
from app.core.database import get_db
from app.core.dependencies import TokenPayload, get_current_admin

router = APIRouter(tags=["auth"])


def _get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    """Dependency to create AuthService with repository."""
    repo = AuthRepository(db)
    return AuthService(repo)


@router.post("/api/admin/login", response_model=TokenResponse)
async def admin_login(
    request: AdminLoginRequest,
    service: AuthService = Depends(_get_auth_service),
) -> TokenResponse:
    """Authenticate admin and return JWT token."""
    result = await service.authenticate_admin(
        store_identifier=request.store_identifier,
        username=request.username,
        password=request.password,
    )
    return TokenResponse(**result)


@router.post("/api/table/login", response_model=TokenResponse)
async def table_login(
    request: TableLoginRequest,
    service: AuthService = Depends(_get_auth_service),
) -> TokenResponse:
    """Authenticate table and return JWT token."""
    result = await service.authenticate_table(
        store_identifier=request.store_identifier,
        table_number=request.table_number,
        password=request.password,
    )
    return TokenResponse(**result)


@router.post("/api/admin/logout", response_model=MessageResponse)
async def admin_logout(
    current_admin: TokenPayload = Depends(get_current_admin),
) -> MessageResponse:
    """Logout admin (stateless - client should discard token)."""
    return MessageResponse(message="Logged out successfully")
