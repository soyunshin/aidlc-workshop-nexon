"""Menu service - business logic for menu and category management."""

from app.core.exceptions import ConflictError, NotFoundError, ValidationError
from app.menu.repository import MenuRepository
from app.menu.schemas import (
    CategoryCreate,
    CategoryUpdate,
    MenuItemCreate,
    MenuItemUpdate,
    MenuOrderUpdate,
)
from app.models.menu import Category, MenuItem


class MenuService:
    """Service handling menu business logic."""

    def __init__(self, repo: MenuRepository):
        self.repo = repo

    # --- Category Operations ---

    async def get_categories(self, store_id: int) -> list[Category]:
        """Get all categories for a store."""
        return await self.repo.find_categories_by_store(store_id)

    async def create_category(
        self, store_id: int, data: CategoryCreate
    ) -> Category:
        """Create a new category."""
        category = Category(
            store_id=store_id,
            name=data.name,
            sort_order=data.sort_order,
        )
        return await self.repo.create_category(category)

    async def update_category(
        self, category_id: int, store_id: int, data: CategoryUpdate
    ) -> Category:
        """Update an existing category."""
        category = await self.repo.get_category_by_id(category_id)
        if not category or category.store_id != store_id:
            raise NotFoundError("Category not found")

        if data.name is not None:
            category.name = data.name
        if data.sort_order is not None:
            category.sort_order = data.sort_order

        return await self.repo.update_category(category)

    async def delete_category(self, category_id: int, store_id: int) -> None:
        """Delete a category (only if empty)."""
        category = await self.repo.get_category_by_id(category_id)
        if not category or category.store_id != store_id:
            raise NotFoundError("Category not found")

        # Check if category has menu items
        item_count = await self.repo.count_items_in_category(category_id)
        if item_count > 0:
            raise ConflictError(
                "Cannot delete category with existing menu items"
            )

        await self.repo.delete_category(category)

    # --- MenuItem Operations ---

    async def get_menu_items(
        self, store_id: int, category_id: int | None = None
    ) -> list[MenuItem]:
        """Get menu items, optionally filtered by category."""
        return await self.repo.find_menu_items(store_id, category_id)

    async def create_menu_item(
        self, store_id: int, data: MenuItemCreate
    ) -> MenuItem:
        """Create a new menu item."""
        # Verify category exists and belongs to store
        category = await self.repo.get_category_by_id(data.category_id)
        if not category or category.store_id != store_id:
            raise ValidationError("Invalid category")

        item = MenuItem(
            store_id=store_id,
            category_id=data.category_id,
            name=data.name,
            price=data.price,
            description=data.description,
            image_url=data.image_url,
            sort_order=data.sort_order,
            is_available=data.is_available,
        )
        return await self.repo.create_menu_item(item)

    async def update_menu_item(
        self, item_id: int, store_id: int, data: MenuItemUpdate
    ) -> MenuItem:
        """Update an existing menu item."""
        item = await self.repo.get_menu_item_by_id(item_id)
        if not item or item.store_id != store_id:
            raise NotFoundError("Menu item not found")

        if data.category_id is not None:
            category = await self.repo.get_category_by_id(data.category_id)
            if not category or category.store_id != store_id:
                raise ValidationError("Invalid category")
            item.category_id = data.category_id
        if data.name is not None:
            item.name = data.name
        if data.price is not None:
            item.price = data.price
        if data.description is not None:
            item.description = data.description
        if data.image_url is not None:
            item.image_url = data.image_url
        if data.sort_order is not None:
            item.sort_order = data.sort_order
        if data.is_available is not None:
            item.is_available = data.is_available

        return await self.repo.update_menu_item(item)

    async def delete_menu_item(self, item_id: int, store_id: int) -> None:
        """Delete a menu item (physical delete)."""
        item = await self.repo.get_menu_item_by_id(item_id)
        if not item or item.store_id != store_id:
            raise NotFoundError("Menu item not found")

        await self.repo.delete_menu_item(item)

    async def update_menu_order(
        self, store_id: int, data: MenuOrderUpdate
    ) -> None:
        """Update display order for multiple menu items."""
        # Verify all items belong to the store
        for order_item in data.items:
            item = await self.repo.get_menu_item_by_id(order_item.id)
            if not item or item.store_id != store_id:
                raise NotFoundError(f"Menu item {order_item.id} not found")

        items_data = [
            {"id": item.id, "sort_order": item.sort_order}
            for item in data.items
        ]
        await self.repo.bulk_update_sort_order(items_data)
