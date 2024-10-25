from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database.database import get_db, create_tables
from database.models import Query, Question
from database.schemas import QueryCreate, QueryUpdate, QueryResponse

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
create_tables()

@app.post("/queries", response_model=QueryResponse)
def create_query(query: QueryCreate, db: Session = Depends(get_db)):
    db_query = Query(name=query.name, description=query.description, pubmed_query=query.pubmed_query)
    db.add(db_query)
    db.commit()
    db.refresh(db_query)

    for question in query.questions:
        db_question = Question(query_id=db_query.id, text=question.text, answer=question.answer)
        db.add(db_question)
    
    db.commit()
    db.refresh(db_query)
    return db_query

@app.get("/queries", response_model=List[QueryResponse])
def list_queries(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(Query).offset(skip).limit(limit).all()

@app.get("/queries/{query_name}", response_model=QueryResponse)
def get_query(query_name: str, db: Session = Depends(get_db)):
    query = db.query(Query).filter(Query.name == query_name).first()
    if query is None:
        raise HTTPException(status_code=404, detail="Query not found")
    return query

@app.put("/queries/{query_name}", response_model=QueryResponse)
def update_query(query_name: str, query_update: QueryUpdate, db: Session = Depends(get_db)):
    db_query = db.query(Query).filter(Query.name == query_name).first()
    if db_query is None:
        raise HTTPException(status_code=404, detail="Query not found")
    
    for key, value in query_update.dict(exclude_unset=True, exclude={'questions'}).items():
        setattr(db_query, key, value)
    
    if query_update.questions:
        db.query(Question).filter(Question.query_id == db_query.id).delete()
        for question in query_update.questions:
            db_question = Question(query_id=db_query.id, text=question.text, answer=question.answer)
            db.add(db_question)
    
    db.commit()
    db.refresh(db_query)
    return db_query

@app.delete("/queries/{query_name}", response_model=QueryResponse)
def delete_query(query_name: str, db: Session = Depends(get_db)):
    db_query = db.query(Query).filter(Query.name == query_name).first()
    if db_query is None:
        raise HTTPException(status_code=404, detail="Query not found")
    db.delete(db_query)
    db.commit()
    return db_query