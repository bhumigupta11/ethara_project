from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(IntegrityError)
    async def integrity_error_handler(request, exc: IntegrityError):
        detail = str(exc.orig) if exc.orig is not None else str(exc)
        return JSONResponse(status_code=400, content={"detail": "Database integrity error", "error": detail})

    @app.exception_handler(ValueError)
    async def value_error_handler(request, exc: ValueError):
        return JSONResponse(status_code=400, content={"detail": str(exc)})
