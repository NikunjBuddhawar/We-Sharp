from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import SkillExchangeRequest, User
from schemas import SkillRequestCreate, SkillRequestResponse
from auth.dependencies import get_current_user

router = APIRouter()

@router.post("/requests/", response_model=SkillRequestResponse)
def send_request(
    request: SkillRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_request = SkillExchangeRequest(
        from_user_id=current_user.id,
        to_user_id=request.to_user_id,
        skill_offered=request.skill_offered,
        skill_requested=request.skill_requested,
        message=request.message,
        status="pending"
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request

@router.get("/requests/received", response_model=List[SkillRequestResponse])
def get_received_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(SkillExchangeRequest).filter(
        SkillExchangeRequest.to_user_id == current_user.id
    ).all()
    
@router.get("/requests/sent", response_model=List[SkillRequestResponse])
def get_sent_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(SkillExchangeRequest).filter(
        SkillExchangeRequest.from_user_id == current_user.id
    ).all()


@router.post("/requests/{request_id}/respond")
def respond_to_request(
    request_id: int,
    response: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    req = db.query(SkillExchangeRequest).filter(SkillExchangeRequest.id == request_id).first()

    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    if req.to_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed")

    if response not in {"accepted", "rejected"}:
        raise HTTPException(status_code=400, detail="Invalid response")

    if req.status != "pending":
        raise HTTPException(status_code=400, detail="Request is already handled")

    if response == "accepted":
        req.status = "accepted"

        sender = db.query(User).filter(User.id == req.from_user_id).first()
        receiver = current_user

        sender_giving = sender.giving_skills.split(',') if sender.giving_skills else []
        sender_wanted = sender.wanted_skills.split(',') if sender.wanted_skills else []
        receiver_giving = receiver.giving_skills.split(',') if receiver.giving_skills else []
        receiver_wanted = receiver.wanted_skills.split(',') if receiver.wanted_skills else []

        if req.skill_offered not in sender_giving:
            raise HTTPException(status_code=400, detail="Sender no longer has the offered skill")
        if req.skill_requested not in receiver_giving:
            raise HTTPException(status_code=400, detail="You no longer have the requested skill")

        sender_giving.remove(req.skill_offered)
        receiver_giving.remove(req.skill_requested)

        if req.skill_requested in sender_wanted:
            sender_wanted.remove(req.skill_requested)
        if req.skill_offered in receiver_wanted:
            receiver_wanted.remove(req.skill_offered)

        if req.skill_requested not in sender_giving:
            sender_giving.append(req.skill_requested)
        if req.skill_offered not in receiver_giving:
            receiver_giving.append(req.skill_offered)

        sender.giving_skills = ",".join(sender_giving) if sender_giving else ""
        sender.wanted_skills = ",".join(sender_wanted) if sender_wanted else ""
        receiver.giving_skills = ",".join(receiver_giving) if receiver_giving else ""
        receiver.wanted_skills = ",".join(receiver_wanted) if receiver_wanted else ""

        db.query(SkillExchangeRequest).filter(
            SkillExchangeRequest.from_user_id == sender.id,
            SkillExchangeRequest.skill_offered == req.skill_offered,
            SkillExchangeRequest.status == "pending",
            SkillExchangeRequest.id != req.id
        ).delete(synchronize_session=False)

    else:
        req.status = "rejected"

    db.commit()
    return {"status": "success", "message": f"Request {response}."}
