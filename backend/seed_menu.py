"""Seed menu data - creates sample categories and menu items."""

import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_maker, engine
from app.models import Base
from app.models.menu import Category, MenuItem
from app.models.store import Store


async def seed_menu() -> None:
    """Create sample menu data."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        session: AsyncSession

        # Get store
        result = await session.execute(
            select(Store).where(Store.store_identifier == "store001")
        )
        store = result.scalar_one_or_none()
        if not store:
            print("Store not found. Run seed.py first.")
            return

        # Check if categories already exist
        result = await session.execute(
            select(Category).where(Category.store_id == store.id)
        )
        if result.scalars().first():
            print("Menu data already exists. Skipping.")
            return

        # Create categories
        cat_main = Category(store_id=store.id, name="메인", sort_order=1)
        cat_side = Category(store_id=store.id, name="사이드", sort_order=2)
        cat_drink = Category(store_id=store.id, name="음료", sort_order=3)
        session.add_all([cat_main, cat_side, cat_drink])
        await session.flush()

        # Create menu items
        items = [
            MenuItem(store_id=store.id, category_id=cat_main.id, name="김치찌개", price=8000, description="돼지고기와 묵은지로 끓인 얼큰한 찌개", sort_order=1),
            MenuItem(store_id=store.id, category_id=cat_main.id, name="된장찌개", price=7500, description="두부와 야채가 듬뿍 들어간 구수한 찌개", sort_order=2),
            MenuItem(store_id=store.id, category_id=cat_main.id, name="제육볶음", price=9000, description="매콤달콤 양념에 볶은 돼지고기", sort_order=3),
            MenuItem(store_id=store.id, category_id=cat_main.id, name="비빔밥", price=8500, description="신선한 야채와 고추장의 조화", sort_order=4),
            MenuItem(store_id=store.id, category_id=cat_main.id, name="불고기", price=11000, description="달콤한 간장 양념의 소고기 불고기", sort_order=5),
            MenuItem(store_id=store.id, category_id=cat_side.id, name="계란말이", price=5000, description="부드러운 계란말이", sort_order=1),
            MenuItem(store_id=store.id, category_id=cat_side.id, name="감자튀김", price=4500, description="바삭한 감자튀김", sort_order=2),
            MenuItem(store_id=store.id, category_id=cat_side.id, name="떡볶이", price=5500, description="매콤한 떡볶이", sort_order=3),
            MenuItem(store_id=store.id, category_id=cat_drink.id, name="콜라", price=2000, description="시원한 콜라 500ml", sort_order=1),
            MenuItem(store_id=store.id, category_id=cat_drink.id, name="사이다", price=2000, description="청량한 사이다 500ml", sort_order=2),
            MenuItem(store_id=store.id, category_id=cat_drink.id, name="맥주", price=4000, description="시원한 생맥주 500ml", sort_order=3),
        ]
        session.add_all(items)
        await session.commit()

        print(f"Menu data created successfully:")
        print(f"  Categories: 3 (메인, 사이드, 음료)")
        print(f"  Menu items: {len(items)}")


if __name__ == "__main__":
    asyncio.run(seed_menu())
