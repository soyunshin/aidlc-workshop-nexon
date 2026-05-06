"""Menu module Pydantic schemas."""

from pydantic import BaseModel, Field


# --- Category Schemas ---


class CategoryCreate(BaseModel):
    """Request to create a category."""

    name: str = Field(min_length=1, max_length=50)
    sort_order: int = Field(default=0, ge=0)


class CategoryUpdate(BaseModel):
    """Request to update a category."""

    name: str | None = Field(default=None, min_length=1, max_length=50)
    sort_order: int | None = Field(default=None, ge=0)


class CategoryResponse(BaseModel):
    """Category response."""

    id: int
    name: str
    sort_order: int

    model_config = {"from_attributes": True}


# --- MenuItem Schemas ---


class MenuItemCreate(BaseModel):
    """Request to create a menu item."""

    category_id: int = Field(gt=0)
    name: str = Field(min_length=1, max_length=100)
    price: int = Field(ge=0)
    description: str | None = Field(default=None, max_length=1000)
    image_url: str | None = Field(default=None, max_length=500)
    sort_order: int = Field(default=0, ge=0)
    is_available: bool = Field(default=True)


class MenuItemUpdate(BaseModel):
    """Request to update a menu item."""

    category_id: int | None = Field(default=None, gt=0)
    name: str | None = Field(default=None, min_length=1, max_length=100)
    price: int | None = Field(default=None, ge=0)
    description: str | None = None
    image_url: str | None = None
    sort_order: int | None = Field(default=None, ge=0)
    is_available: bool | None = None


class MenuItemResponse(BaseModel):
    """Menu item response."""

    id: int
    category_id: int
    name: str
    price: int
    description: str | None
    image_url: str | None
    sort_order: int
    is_available: bool

    model_config = {"from_attributes": True}


class MenuOrderItem(BaseModel):
    """Single item in menu order update request."""

    id: int = Field(gt=0)
    sort_order: int = Field(ge=0)


class MenuOrderUpdate(BaseModel):
    """Request to update menu item display order."""

    items: list[MenuOrderItem] = Field(min_length=1)
