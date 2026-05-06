"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.auth.router import router as auth_router
from app.menu.router import router as menu_router
from app.order.router import router as order_router
from app.table.router import router as table_router
from app.sse.router import router as sse_router
from app.core.config import get_settings
from app.core.database import engine
from app.core.exceptions import register_exception_handlers
from app.core.logging import setup_logging
from app.core.middleware import (
    LoggingMiddleware,
    RequestIDMiddleware,
    SecurityHeadersMiddleware,
)


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()
    setup_logging()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        docs_url="/docs" if settings.debug else None,
        redoc_url="/redoc" if settings.debug else None,
    )

    # Register middleware (order matters: last added = first executed)
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(RequestIDMiddleware)
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["Authorization", "Content-Type"],
    )

    # Register exception handlers
    register_exception_handlers(app)

    # Register routers
    app.include_router(auth_router)
    app.include_router(menu_router)
    app.include_router(order_router)
    app.include_router(table_router)
    app.include_router(sse_router)

    # Health check endpoints
    @app.get("/health", tags=["health"])
    async def health_check():
        """Shallow health check - app is alive."""
        return {"status": "healthy", "app": settings.app_name}

    @app.get("/health/db", tags=["health"])
    async def health_check_db():
        """Deep health check - verify database connectivity."""
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            return {"status": "healthy", "database": "connected"}
        except Exception as e:
            return {"status": "unhealthy", "database": str(e)}

    return app


app = create_app()
