from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import auth, customers, dashboard, orders, products
from app.core.config import get_settings
from app.database.database import AsyncSessionLocal, init_db
from app.middleware.exception_handler import register_exception_handlers
from app.services.demo_service import seed_demo_data

settings = get_settings()

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_PREFIX}/openapi.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

@app.on_event("startup")
async def initialize_database():
    await init_db()
    async with AsyncSessionLocal() as session:
        await seed_demo_data(session)

app.include_router(auth, prefix=f"{settings.API_PREFIX}/auth", tags=["Authentication"])
app.include_router(products, prefix=f"{settings.API_PREFIX}/products", tags=["Products"])
app.include_router(customers, prefix=f"{settings.API_PREFIX}/customers", tags=["Customers"])
app.include_router(orders, prefix=f"{settings.API_PREFIX}/orders", tags=["Orders"])
app.include_router(dashboard, prefix=f"{settings.API_PREFIX}/dashboard", tags=["Dashboard"])

@app.get("/")
async def root():
    return {"message": "Ethara Inventory API is running."}
