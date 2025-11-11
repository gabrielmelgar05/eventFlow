<<<<<<< HEAD
# server/alembic/env.py

# alembic/env.py
from __future__ import annotations
from logging.config import fileConfig
from pathlib import Path
import os
import sys

from alembic import context
from sqlalchemy import engine_from_config, pool

# --- permitir importar "app.*" ---
BASE_DIR = Path(__file__).resolve().parents[1]
sys.path.append(str(BASE_DIR))

# carrega .env (opcional, se já carrega em outro ponto do app, pode manter)
from dotenv import load_dotenv
load_dotenv(BASE_DIR / ".env")

# importa Base e MODELOS (importar os modelos é IMPORTANTÍSSIMO para o metadata)
from app.core.db import Base
# Garanta que TODOS os models sejam importados, para popular Base.metadata:
from app.models import user, category, location, event  # ajuste a lista conforme seus arquivos

# Alembic config
config = context.config

# Sobrescreve a URL do ini pela env var, se existir
=======
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# >>> carregue o .env
from dotenv import load_dotenv
load_dotenv()

config = context.config

# injeta DATABASE_URL vindo do .env
>>>>>>> 429f07bb4c0d7b126849e3c5ca17e029bf883e5a
db_url = os.getenv("DATABASE_URL")
if db_url:
    config.set_main_option("sqlalchemy.url", db_url)

<<<<<<< HEAD
# Logging do alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Este é o metadata que o Alembic inspeciona
=======
# logger do alembic
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# importe seu Base.metadata
from app.core.db import Base  # ajuste o caminho se diferente
>>>>>>> 429f07bb4c0d7b126849e3c5ca17e029bf883e5a
target_metadata = Base.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    connectable = engine_from_config(
<<<<<<< HEAD
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        future=True,
=======
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
>>>>>>> 429f07bb4c0d7b126849e3c5ca17e029bf883e5a
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
