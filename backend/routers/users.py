from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import User
from schemas import UserPublic
from sqlalchemy import or_

router = APIRouter()

@router.get("/users/public", response_model=List[UserPublic])
def get_public_users(skill: Optional[str] = None, id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(User)
    if id:
        query = query.filter(User.id == id)
    elif skill:
        query = query.filter(
            or_(
                User.giving_skills.like(f"%{skill}%"),
                User.wanted_skills.like(f"%{skill}%")
            )
        )
    users = query.all()

    return [
        {
            "id": user.id,
            "name": user.name or "",
            "location": user.location,
            "profile_picture": user.profile_picture,
            "availability": user.availability,
            "giving_skills": user.giving_skills.split(",") if user.giving_skills else [],
            "wanted_skills": user.wanted_skills.split(",") if user.wanted_skills else [],
        }
        for user in users
    ]

@router.get("/users/{id}", response_model=UserPublic)
def get_user_by_id(id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
