from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    location: Optional[str] = None
    skills_offered: Optional[List[str]] = []
    skills_wanted: Optional[List[str]] = []
    availability: Optional[str] = None
    profile_pic_url: Optional[str] = None
    profile_type: Optional[str] = "public"

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    location: Optional[str]
    availability: Optional[str]
    giving_skills: Optional[str]
    wanted_skills: Optional[str]
    profile_pic_url: Optional[str] = Field(default=None, alias="profile_picture")
    profile_type: Optional[str]

    class Config:
        orm_mode = True
        allow_population_by_field_name = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserUpdate(BaseModel):
    username: Optional[str] = None
    location: Optional[str] = None
    availability: Optional[str] = None
    profile_pic_url: Optional[str] = None
    profile_type: Optional[str] = None
    skills_offered: Optional[List[str]] = None
    skills_wanted: Optional[List[str]] = None
    
class UserPublic(BaseModel):
    id: int
    name: str
    location: Optional[str]
    profile_picture: Optional[str]
    giving_skills: List[str]
    wanted_skills: List[str]
    availability: Optional[str]

    class Config:
        from_attributes = True

class SkillRequestBase(BaseModel):
    to_user_id: int
    skill_offered: str
    skill_requested: str
    message: Optional[str] = None  # ✅ new field

class SkillRequestCreate(SkillRequestBase):
    pass

class SkillRequestResponse(SkillRequestBase):
    id: int
    from_user_id: int
    status: str

    class Config:
        from_attributes = True
