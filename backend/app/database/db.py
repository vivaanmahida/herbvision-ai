import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./herbvision.db")

engine = create_async_engine(DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def init_db():
    from app.database.models import Herb, Feedback  # noqa: F401
    from app.database.seed import seed_herbs
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await seed_herbs()


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
