# Importa os models para o Alembic enxergar o metadata
from .user import User
from .category import Category
from .location import Location
from .event import Event

__all__ = ["User", "Category", "Location", "Event"]
