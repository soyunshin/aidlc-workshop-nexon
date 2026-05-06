"""Unit tests for MenuService business logic."""

from unittest.mock import AsyncMock, MagicMock

import pytest

from app.core.exceptions import ConflictError, NotFoundError, ValidationError
from app.menu.schemas import CategoryCreate, CategoryUpdate, MenuItemCreate, MenuOrderUpdate, MenuOrderItem
from app.menu.service import MenuService


@pytest.fixture
def mock_repo():
    """Create a mock MenuRepository."""
    return AsyncMock()


@pytest.fixture
def menu_service(mock_repo):
    """Create MenuService with mock repository."""
    return MenuService(mock_repo)


class TestCategoryOperations:
    """Tests for category CRUD operations."""

    @pytest.mark.asyncio
    async def test_get_categories(self, menu_service, mock_repo):
        """Should return categories from repository."""
        mock_repo.find_categories_by_store = AsyncMock(return_value=[MagicMock(), MagicMock()])
        result = await menu_service.get_categories(store_id=1)
        assert len(result) == 2
        mock_repo.find_categories_by_store.assert_called_once_with(1)

    @pytest.mark.asyncio
    async def test_create_category(self, menu_service, mock_repo):
        """Should create and return a category."""
        mock_result = MagicMock()
        mock_result.name = "음료"
        mock_result.sort_order = 0
        mock_repo.create_category = AsyncMock(return_value=mock_result)
        data = CategoryCreate(name="음료", sort_order=0)
        result = await menu_service.create_category(store_id=1, data=data)
        assert result.name == "음료"

    @pytest.mark.asyncio
    async def test_update_category_not_found(self, menu_service, mock_repo):
        """Should raise NotFoundError for non-existent category."""
        mock_repo.get_category_by_id = AsyncMock(return_value=None)
        data = CategoryUpdate(name="새이름")
        with pytest.raises(NotFoundError):
            await menu_service.update_category(99, store_id=1, data=data)

    @pytest.mark.asyncio
    async def test_delete_category_with_items(self, menu_service, mock_repo):
        """Should raise ConflictError when category has items."""
        mock_category = MagicMock(id=1, store_id=1)
        mock_repo.get_category_by_id = AsyncMock(return_value=mock_category)
        mock_repo.count_items_in_category = AsyncMock(return_value=3)

        with pytest.raises(ConflictError):
            await menu_service.delete_category(1, store_id=1)

    @pytest.mark.asyncio
    async def test_delete_empty_category(self, menu_service, mock_repo):
        """Should delete category when it has no items."""
        mock_category = MagicMock(id=1, store_id=1)
        mock_repo.get_category_by_id = AsyncMock(return_value=mock_category)
        mock_repo.count_items_in_category = AsyncMock(return_value=0)
        mock_repo.delete_category = AsyncMock()

        await menu_service.delete_category(1, store_id=1)
        mock_repo.delete_category.assert_called_once()


class TestMenuItemOperations:
    """Tests for menu item CRUD operations."""

    @pytest.mark.asyncio
    async def test_create_item_invalid_category(self, menu_service, mock_repo):
        """Should raise ValidationError for invalid category."""
        mock_repo.get_category_by_id = AsyncMock(return_value=None)
        data = MenuItemCreate(category_id=99, name="커피", price=5000)

        with pytest.raises(ValidationError):
            await menu_service.create_menu_item(store_id=1, data=data)

    @pytest.mark.asyncio
    async def test_create_item_success(self, menu_service, mock_repo):
        """Should create menu item with valid category."""
        mock_category = MagicMock(id=1, store_id=1)
        mock_repo.get_category_by_id = AsyncMock(return_value=mock_category)
        mock_result = MagicMock()
        mock_result.name = "커피"
        mock_result.price = 5000
        mock_repo.create_menu_item = AsyncMock(return_value=mock_result)
        data = MenuItemCreate(category_id=1, name="커피", price=5000)

        result = await menu_service.create_menu_item(store_id=1, data=data)
        assert result.name == "커피"

    @pytest.mark.asyncio
    async def test_delete_item_not_found(self, menu_service, mock_repo):
        """Should raise NotFoundError for non-existent item."""
        mock_repo.get_menu_item_by_id = AsyncMock(return_value=None)

        with pytest.raises(NotFoundError):
            await menu_service.delete_menu_item(99, store_id=1)

    @pytest.mark.asyncio
    async def test_delete_item_wrong_store(self, menu_service, mock_repo):
        """Should raise NotFoundError when item belongs to different store."""
        mock_item = MagicMock(id=1, store_id=2)  # Different store
        mock_repo.get_menu_item_by_id = AsyncMock(return_value=mock_item)

        with pytest.raises(NotFoundError):
            await menu_service.delete_menu_item(1, store_id=1)
