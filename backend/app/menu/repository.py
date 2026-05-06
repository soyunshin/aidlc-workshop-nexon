"""Menu repository - database access for menu and categories."""

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.menu import Category, MenuItem


class MenuRepository:
    """Repository for menu-related database operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    # --- Category Operations ---

    async def find_categories_by_store(self, store_id: int) -> list[Category]:
        """Get all categories for a store, ordered by sort_order."""
        result = await self.db.execute(
            select(Category)
            .where(Category.store_id == store_id)
            .order_by(Category.sort_order)
        )
        return list(result.scalars().all())

    async def get_category_by_id(self, category_id: int) -> Category | None:
        """Get a category by ID."""
        result = await self.db.execute(
            select(Category).where(Category.id == category_id)
        )
        return result.scalar_one_or_none()

    async def create_category(self, category: Category) -> Category:
        """Create a new category."""
        self.db.add(category)
        await self.db.flush()
        await self.db.refresh(category)
        return category

    async def update_category(self, category: Category) -> Category:
        """Update an existing category."""
        await self.db.flush()
        await self.db.refresh(category)
        return category

    async def delete_category(self, category: Category) -> None:
        """Delete a category."""
        await self.db.delete(category)
        await self.db.flush()

    # --- MenuItem Operations ---

    async def find_menu_items(
        self, store_id: int, category_id: int | None = None
    ) -> list[MenuItem]:
        """Get menu items for a store, optionally filtered by category."""
        query = (
            select(MenuItem)
            .where(MenuItem.store_id == store_id)
            .order_by(MenuItem.sort_order)
        )
        if category_id is not None:
            query = query.where(MenuItem.category_id == category_id)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def get_menu_item_by_id(self, item_id: int) -> MenuItem | None:
        """Get a menu item by ID."""
        result = await self.db.execute(
            select(MenuItem).where(MenuItem.id == item_id)
        )
        return result.scalar_one_or_none()

    async def create_menu_item(self, item: MenuItem) -> MenuItem:
        """Create a new menu item."""
        self.db.add(item)
        await self.db.flush()
        await self.db.refresh(item)
        return item

    async def update_menu_item(self, item: MenuItem) -> MenuItem:
        """Update an existing menu item."""
        await self.db.flush()
        await self.db.refresh(item)
        return item

    async def delete_menu_item(self, item: MenuItem) -> None:
        """Delete a menu item."""
        await self.db.delete(item)
        await self.db.flush()

    async def bulk_update_sort_order(
        self, items: list[dict]
    ) -> None:
        """Bulk update sort_order for multiple menu items.

        Args:
            items: List of dicts with 'id' and 'sort_order' keys.
        """
        for item_data in items:
            await self.db.execute(
                update(MenuItem)
                .where(MenuItem.id == item_data["id"])
                .values(sort_order=item_data["sort_order"])
            )
        await self.db.flush()

    async def count_items_in_category(self, category_id: int) -> int:
        """Count menu items in a category."""
        from sqlalchemy import func

        result = await self.db.execute(
            select(func.count(MenuItem.id)).where(
                MenuItem.category_id == category_id
            )
        )
        return result.scalar_one()
