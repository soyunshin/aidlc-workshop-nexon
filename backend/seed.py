"""Seed data script - creates initial Store and Admin records.

Usage:
    python seed.py

Idempotent: skips creation if records already exist.
"""

import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_maker, engine
from app.core.security import hash_password
from app.models import Base
from app.models.admin import Admin
from app.models.store import Store


async def seed_data() -> None:
    """Create initial seed data."""
    # Create tables if they don't exist (for development convenience)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        session: AsyncSession

        # Check if store already exists
        result = await session.execute(
            select(Store).where(Store.store_identifier == "store001")
        )
        existing_store = result.scalar_one_or_none()

        if existing_store:
            print("Seed data already exists. Skipping.")
            return

        # Create default store
        store = Store(
            name="기본매장",
            store_identifier="store001",
        )
        session.add(store)
        await session.flush()  # Get store.id

        # Create default admin
        admin = Admin(
            store_id=store.id,
            username="admin",
            password_hash=hash_password("admin123"),
        )
        session.add(admin)
        await session.commit()

        print(f"Seed data created successfully:")
        print(f"  Store: {store.name} (identifier: {store.store_identifier})")
        print(f"  Admin: {admin.username} (password: admin123)")


if __name__ == "__main__":
    asyncio.run(seed_data())
