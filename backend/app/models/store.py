"""Store model."""

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base, TimestampMixin


class Store(Base, TimestampMixin):
    """Store entity - represents a single restaurant/shop."""

    __tablename__ = "stores"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    store_identifier: Mapped[str] = mapped_column(
        String(50), nullable=False, unique=True
    )

    # Relationships
    admins = relationship("Admin", back_populates="store", lazy="selectin")
    tables = relationship("Table", back_populates="store", lazy="selectin")
    categories = relationship("Category", back_populates="store", lazy="selectin")
