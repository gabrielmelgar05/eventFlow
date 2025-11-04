from sqlalchemy import String, Integer, ForeignKey, Numeric, Date, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.db import Base

class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(160))
    description: Mapped[str] = mapped_column(String(1000))
    date: Mapped[Date]
    time: Mapped[Time]
    price: Mapped[float] = mapped_column(Numeric(10,2))

    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    location_id: Mapped[int] = mapped_column(ForeignKey("locations.id"))
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)

    category = relationship("Category")
    location = relationship("Location")
