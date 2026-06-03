import asyncio
import os
import sys
from logging.config import fileConfig

from alembic import context
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.core.config import get_settings  # noqa: E402
from app.models.base import Base  # noqa: E402
from app.models.models import *  # noqa: F401,E402

settings = get_settings()

def get_url() -> str:
    url = str(settings.DATABASE_URL)
    return url.replace("postgres://", "postgresql+asyncpg://", 1)

config = context.config
fileConfig(config.config_file_name)
config.set_main_option("sqlalchemy.url", get_url())
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = create_async_engine(config.get_main_option("sqlalchemy.url"), poolclass=pool.NullPool)

    async def do_run() -> None:
        async with connectable.connect() as connection:
            await connection.run_sync(lambda sync_conn: context.configure(connection=sync_conn, target_metadata=target_metadata))
            async with connection.begin() as transaction:
                await connection.run_sync(context.run_migrations)

    asyncio.run(do_run())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
