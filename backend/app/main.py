from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.database import Base, engine
from app.core.security import hash_password

from app.api.routes.auth import router as auth_router
from app.api.routes.user import router as user_router
from app.api.routes.category import router as category_router
from app.api.routes.post import router as post_router
from app.api.routes.role import router as role_router
from app.api.routes.permission import router as permission_router
from app.api.dashboard import router as dashboard_router


# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(
    title="Blog CMS API",
    version="1.0.0",
)

# Static files
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth_router)
app.include_router(role_router)
app.include_router(permission_router)
app.include_router(user_router)
app.include_router(category_router)
app.include_router(post_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {
        "status": True,
        "message": "Blog CMS API Running",
    }