"""Admin model."""

from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models import Base, TimestampMixin


class Admin(Base, TimestampMixin):
    """Admin entity - store administrator account."""

    __tablename__ = "admins"
    __table_args__ = (
        UniqueConstraint("store_id", "username", name="uq_admin_store_username"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    store_id: Mapped[int] = mapped_column(
        ForeignKey("stores.id", ondelete="RESTRICT"), nullable=False
    )
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    # Relationships
    store = relationship("Store", back_populates="admins")
