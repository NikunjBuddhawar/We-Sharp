from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User
from schemas import UserCreate, UserOut, LoginRequest, TokenResponse, UserUpdate
from database import get_db
from auth.hash_toolkit import hash_password, verify_password
from auth.jwt_handler import create_access_token
from auth.dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", response_model=UserOut)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_pwd = hash_password(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pwd,
        location=user.location,
        giving_skills=",".join(user.skills_offered),
        wanted_skills=",".join(user.skills_wanted),
        availability=user.availability,
        profile_picture=user.profile_pic_url,
        profile_type=user.profile_type
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": token}

@router.get("/me", response_model=UserOut)
def read_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_profile(update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if update.username is not None:
        current_user.username = update.username
    if update.location is not None:
        current_user.location = update.location
    if update.availability is not None:
        current_user.availability = update.availability
    if update.profile_pic_url is not None:
        current_user.profile_pic_url = update.profile_pic_url
    if update.profile_type is not None:
        current_user.profile_type = update.profile_type
    if update.skills_offered is not None:
        current_user.skills_offered = ",".join(update.skills_offered)
    if update.skills_wanted is not None:
        current_user.skills_wanted = ",".join(update.skills_wanted)

    db.commit()
    db.refresh(current_user)
    return current_user
