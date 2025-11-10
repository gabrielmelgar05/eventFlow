from __future__ import annotations

from datetime import date, time
from decimal import Decimal

from sqlalchemy import (
    Integer, String, Date, Time, Numeric, ForeignKey
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base

class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # >>> TIPAGEM CORRETA: tipos Python dentro de Mapped[...]
    date: Mapped[date] = mapped_column(Date, nullable=False)
    time: Mapped[time] = mapped_column(Time, nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)

    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    category_id: Mapped[int | None] = mapped_column(ForeignKey("categories.id"))
    location_id: Mapped[int | None] = mapped_column(ForeignKey("locations.id"))

    category: Mapped["Category | None"] = relationship(back_populates="events")
    location: Mapped["Location | None"] = relationship(back_populates="events")
