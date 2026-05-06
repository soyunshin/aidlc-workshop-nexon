"""Auth module Pydantic schemas for request/response validation."""

from pydantic import BaseModel, Field


class AdminLoginRequest(BaseModel):
    """Admin login request body."""

    store_identifier: str = Field(min_length=1, max_length=50)
    username: str = Field(min_length=1, max_length=50)
    password: str = Field(min_length=1, max_length=128)


class TableLoginRequest(BaseModel):
    """Table login request body."""

    store_identifier: str = Field(min_length=1, max_length=50)
    table_number: int = Field(gt=0)
    password: str = Field(min_length=1, max_length=128)


class TokenResponse(BaseModel):
    """JWT token response."""

    access_token: str
    token_type: str = "bearer"


class MessageResponse(BaseModel):
    """Simple message response."""

    message: str
