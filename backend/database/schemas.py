from pydantic import BaseModel
from typing import List, Optional

class QuestionCreate(BaseModel):
    text: str
    answer: str

class QuestionResponse(QuestionCreate):
    id: int
    query_id: int

    class Config:
        orm_mode = True

class QueryCreate(BaseModel):
    name: str
    description: str
    pubmed_query: str
    questions: List[QuestionCreate]

class QueryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    pubmed_query: Optional[str] = None
    questions: Optional[List[QuestionCreate]] = None

class QueryResponse(BaseModel):
    id: int
    name: str
    description: str
    pubmed_query: str
    questions: List[QuestionResponse]

    class Config:
        orm_mode = True