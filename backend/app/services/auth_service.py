import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.models import User
from app.schemas.auth import UserCreate
from app.utils.security import create_access_token, create_password_hash, verify_password

logger = logging.getLogger(__name__)


async def get_user_by_email(session: AsyncSession, email: str) -> User | None:
    result = await session.execute(select(User).where(User.email == email))
    return result.scalars().first()


async def create_user(session: AsyncSession, payload: UserCreate) -> User:
    existing = await get_user_by_email(session, payload.email)
    if existing:
        raise ValueError("A user with this email already exists")
    user = User(
        name=payload.name,
        email=payload.email,
        hashed_password=create_password_hash(payload.password),
        role=payload.role.lower() if payload.role else "manager",
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def authenticate_user(session: AsyncSession, email: str, password: str) -> User | None:
    user = await get_user_by_email(session, email)
    if not user:
        logger.info("authenticate_user: no user found for email=%s", email)
        return None
    verified = verify_password(password, user.hashed_password)
    logger.info("authenticate_user: email=%s user_id=%s verified=%s", email, getattr(user, 'id', None), verified)
    if not verified:
        return None
    return user


def create_tokens(user: User) -> dict:
    token = create_access_token(subject=user.id, email=user.email, role=user.role)
    return {"access_token": token, "token_type": "bearer"}
