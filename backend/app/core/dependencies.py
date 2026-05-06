"""FastAPI dependencies for authentication and authorization."""

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
import jwt

from app.core.config import Settings, get_settings
from app.core.exceptions import AuthenticationError, AuthorizationError
from app.core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/login", auto_error=False)


class TokenPayload:
    """Decoded JWT token payload."""

    def __init__(self, payload: dict):
        self.sub: str = payload.get("sub", "")
        self.store_id: int = payload.get("store_id", 0)
        self.role: str = payload.get("role", "")
        self.table_id: int | None = payload.get("table_id")
        self.table_number: int | None = payload.get("table_number")
        self.session_id: int | None = payload.get("session_id")


async def get_current_user(
    token: str | None = Depends(oauth2_scheme),
    settings: Settings = Depends(get_settings),
) -> TokenPayload:
    """Extract and validate the current user from JWT token.

    Raises:
        AuthenticationError: If token is missing, expired, or invalid.
    """
    if token is None:
        raise AuthenticationError("Authentication required")

    try:
        payload = decode_access_token(token)
    except jwt.ExpiredSignatureError:
        raise AuthenticationError("Token has expired")
    except jwt.InvalidTokenError:
        raise AuthenticationError("Invalid token")

    return TokenPayload(payload)


async def get_current_admin(
    user: TokenPayload = Depends(get_current_user),
) -> TokenPayload:
    """Verify the current user has admin role.

    Raises:
        AuthorizationError: If user is not an admin.
    """
    if user.role != "admin":
        raise AuthorizationError("Admin access required")
    return user


async def get_current_table(
    user: TokenPayload = Depends(get_current_user),
) -> TokenPayload:
    """Verify the current user has table role.

    Raises:
        AuthorizationError: If user is not a table.
    """
    if user.role != "table":
        raise AuthorizationError("Table access required")
    return user
