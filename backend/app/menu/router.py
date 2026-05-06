"""Menu router - menu and category API endpoints."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import TokenPayload, get_current_admin, get_current_user
from app.menu.repository import MenuRepository
from app.menu.schemas import (
    CategoryCreate,
    CategoryResponse,
    CategoryUpdate,
    MenuItemCreate,
    MenuItemResponse,
    MenuItemUpdate,
    MenuOrderUpdate,
)
from app.menu.service import MenuService

router = APIRouter(tags=["menu"])


def _get_menu_service(db: AsyncSession = Depends(get_db)) -> MenuService:
    """Dependency to create MenuService with repository."""
    repo = MenuRepository(db)
    return MenuService(repo)


# --- Public Endpoints (any authenticated user) ---


@router.get("/api/menu/categories", response_model=list[CategoryResponse])
async def get_categories(
    current_user: TokenPayload = Depends(get_current_user),
    service: MenuService = Depends(_get_menu_service),
) -> list[CategoryResponse]:
    """Get all categories for the current store."""
    categories = await service.get_categories(current_user.store_id)
    return [CategoryResponse.model_validate(c) for c in categories]


@router.get("/api/menu/items", response_model=list[MenuItemResponse])
async def get_menu_items(
    category_id: int | None = Query(default=None, gt=0),
    current_user: TokenPayload = Depends(get_current_user),
    service: MenuService = Depends(_get_menu_service),
) -> list[MenuItemResponse]:
    """Get menu items, optionally filtered by category."""
    items = await service.get_menu_items(current_user.store_id, category_id)
    return [MenuItemResponse.model_validate(i) for i in items]


# --- Admin Endpoints ---


@router.post("/api/admin/menu/categories", response_model=CategoryResponse, status_code=201)
async def create_category(
    data: CategoryCreate,
    current_admin: TokenPayload = Depends(get_current_admin),
    service: MenuService = Depends(_get_menu_service),
) -> CategoryResponse:
    """Create a new category."""
    category = await service.create_category(current_admin.store_id, data)
    return CategoryResponse.model_validate(category)


@router.put("/api/admin/menu/categories/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    data: CategoryUpdate,
    current_admin: TokenPayload = Depends(get_current_admin),
    service: MenuService = Depends(_get_menu_service),
) -> CategoryResponse:
    """Update an existing category."""
    category = await service.update_category(category_id, current_admin.store_id, data)
    return CategoryResponse.model_validate(category)


@router.delete("/api/admin/menu/categories/{category_id}", status_code=204)
async def delete_category(
    category_id: int,
    current_admin: TokenPayload = Depends(get_current_admin),
    service: MenuService = Depends(_get_menu_service),
) -> None:
    """Delete a category (must be empty)."""
    await service.delete_category(category_id, current_admin.store_id)


@router.post("/api/admin/menu/items", response_model=MenuItemResponse, status_code=201)
async def create_menu_item(
    data: MenuItemCreate,
    current_admin: TokenPayload = Depends(get_current_admin),
    service: MenuService = Depends(_get_menu_service),
) -> MenuItemResponse:
    """Create a new menu item."""
    item = await service.create_menu_item(current_admin.store_id, data)
    return MenuItemResponse.model_validate(item)


@router.put("/api/admin/menu/items/{item_id}", response_model=MenuItemResponse)
async def update_menu_item(
    item_id: int,
    data: MenuItemUpdate,
    current_admin: TokenPayload = Depends(get_current_admin),
    service: MenuService = Depends(_get_menu_service),
) -> MenuItemResponse:
    """Update an existing menu item."""
    item = await service.update_menu_item(item_id, current_admin.store_id, data)
    return MenuItemResponse.model_validate(item)


@router.delete("/api/admin/menu/items/{item_id}", status_code=204)
async def delete_menu_item(
    item_id: int,
    current_admin: TokenPayload = Depends(get_current_admin),
    service: MenuService = Depends(_get_menu_service),
) -> None:
    """Delete a menu item."""
    await service.delete_menu_item(item_id, current_admin.store_id)


@router.put("/api/admin/menu/items/order", status_code=204)
async def update_menu_order(
    data: MenuOrderUpdate,
    current_admin: TokenPayload = Depends(get_current_admin),
    service: MenuService = Depends(_get_menu_service),
) -> None:
    """Update display order for menu items."""
    await service.update_menu_order(current_admin.store_id, data)
