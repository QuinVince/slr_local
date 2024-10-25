from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import subprocess
import json
import logging
import os
from dotenv import load_dotenv
from prisma_generator import generate_prisma_diagram

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static directory
app.mount("/static", StaticFiles(directory="static"), name="static")

class QueryRequest(BaseModel):
    query: str

class PubMedQueryRequest(BaseModel):
    query: str
    answers: dict

class SynonymRequest(BaseModel):
    description: str
    questions: list
    answers: dict
    query: str

# Keep only the necessary endpoints (generate_questions, generate_pubmed_query, generate_synonyms, export_prisma)
# Remove all project-related endpoints

@app.post("/generate_questions")
async def generate_questions(request: Request):
    try:
        body = await request.json()
        logger.info(f"Received request body: {body}")
        query = body.get('query')
        if not query:
            raise HTTPException(status_code=400, detail="Query is required")
        
        # Check if MISTRAL_API_KEY is set
        if not os.getenv("MISTRAL_API_KEY"):
            raise HTTPException(status_code=500, detail="MISTRAL_API_KEY environment variable not set")
        
        result = subprocess.run(['python', 'generate_questions.py', query], capture_output=True, text=True)
        logger.info(f"generate_questions.py output: {result.stdout}")
        if result.stderr:
            logger.error(f"generate_questions.py error: {result.stderr}")
        
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            error_message = result.stdout or result.stderr or "Unknown error occurred"
            logger.error(f"Failed to parse JSON: {error_message}")
            raise HTTPException(status_code=500, detail=f"Failed to parse response from generate_questions.py: {error_message}")
    except Exception as e:
        logger.error(f"Error in generate_questions: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_pubmed_query")
async def generate_pubmed_query(request: PubMedQueryRequest):
    try:
        result = subprocess.run(['python', 'generate_pubmed_query.py', request.query, json.dumps(request.answers)], capture_output=True, text=True)
        return {"query": result.stdout.strip()}
    except Exception as e:
        logger.error(f"Error in generate_pubmed_query: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate_synonyms")
async def generate_synonyms(request: SynonymRequest):
    logger.info(f"Received synonym request: {request}")
    try:
        script_path = os.path.join(os.path.dirname(__file__), 'generate_synonyms.py')
        logger.info(f"Looking for script at: {script_path}")
        if not os.path.exists(script_path):
            logger.error(f"Script not found at {script_path}")
            raise FileNotFoundError(f"The script {script_path} was not found.")
        
        logger.info("Running generate_synonyms.py")
        result = subprocess.run(['python', script_path, 
                                 request.description, 
                                 json.dumps(request.questions), 
                                 json.dumps(request.answers), 
                                 request.query], 
                                capture_output=True, text=True)
        logger.info(f"generate_synonyms.py output: {result.stdout}")
        if result.stderr:
            logger.error(f"generate_synonyms.py error: {result.stderr}")
        
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON from generate_synonyms.py: {result.stdout}")
            return {"synonyms": [], "error": "Failed to parse response from generate_synonyms.py"}
    except Exception as e:
        logger.error(f"Error in generate_synonyms: {str(e)}")
        return {"synonyms": [], "error": str(e)}

@app.get("/test_synonyms")
async def test_synonyms():
    logger.debug("test_synonyms endpoint called")
    return {"message": "Synonym route is working"}

@app.get("/export_prisma")
async def export_prisma():
    logger.debug("export_prisma endpoint called")
    try:
        logger.debug("Generating PRISMA diagram...")
        image_path = generate_prisma_diagram()
        logger.debug(f"PRISMA diagram generated successfully at {image_path}")
        if not os.path.exists(image_path):
            logger.error(f"Generated image file not found: {image_path}")
            raise FileNotFoundError(f"Generated image file not found: {image_path}")
        logger.debug(f"Sending file response for {image_path}")
        return FileResponse(image_path, media_type="image/png", filename="prisma_diagram.png")
    except Exception as e:
        logger.error(f"Error in export_prisma: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

# Add this at the end of the file
logger.debug("All routes registered:")
for route in app.routes:
    if hasattr(route, 'methods'):
        logger.debug(f"{route.methods} {route.path}")
    else:
        logger.debug(f"Mount: {route.path}")

if __name__ == "__main__":
    import uvicorn
    logger.info("Starting FastAPI server")
    uvicorn.run(app, host="127.0.0.1", port=8000)
