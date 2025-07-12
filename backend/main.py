from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware  # 👈 NEW
from database import engine
from models import Base
from auth.routes import router as auth_router
from routers import users, requests

# Create all database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# 👇 Add CORS middleware before adding routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods including OPTIONS
    allow_headers=["*"],  # Allow all headers
)

# Register routers
app.include_router(auth_router)
app.include_router(users.router)
app.include_router(requests.router)

# Root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to Skill Swap API"}

# 👇 Custom OpenAPI override to add JWT bearer auth in Swagger
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Skill Swap API",
        version="1.0.0",
        description="API for skill swap platform",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    for path in openapi_schema["paths"]:
        for method in openapi_schema["paths"][path]:
            operation = openapi_schema["paths"][path][method]
            operation.setdefault("security", []).append({"BearerAuth": []})
    app.openapi_schema = openapi_schema
    return app.openapi_schema

# Override OpenAPI schema generator
app.openapi = custom_openapi
