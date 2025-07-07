import os
import json
import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError
from typing import List, Optional, Union
import requests
# import google.generativeai as genai  # No longer needed for quiz generation
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

# Environment variables and defaults
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY not set in environment variables.")
    raise RuntimeError("GEMINI_API_KEY not set in environment variables.")
# genai.configure(api_key=GEMINI_API_KEY)  # Not needed

app = FastAPI(title="AI Quiz Builder API", description="Generate quizzes using Gemini.")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if 'CORS_ORIGINS' not in globals() else CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}

class QuizRequest(BaseModel):
    """Request model for generating a quiz."""
    prompt: str = Field(..., description="Topic or subject for the quiz.")
    role: str = Field(..., description="Target role: teacher, mentor, or student.")
    difficulty: str = Field(..., description="Quiz difficulty: easy, medium, or hard.")
    num_questions: Optional[int] = Field(3, ge=1, le=100, description="Number of questions to generate.")
    explanations: Optional[bool] = Field(False, description="Whether to include explanations for answers.")
    model: Optional[str] = Field(None, description="Override OpenAI model.")
    temperature: Optional[float] = Field(None, description="Override temperature.")
    max_tokens: Optional[int] = Field(None, description="Override max tokens.")

class QuizQuestion(BaseModel):
    text: str
    options: List[str]
    answer: Union[int, List[int]]
    explanation: Optional[str] = None

class SubmitAnswersRequest(BaseModel):
    questions: List[QuizQuestion]
    # Accepts int, list, None, or tuple (answer, time_taken)
    user_answers: List[Union[int, List[int], None, tuple]]


class SubmitAnswersResponse(BaseModel):
    total: int
    correct: int
    wrong: int
    results: List[dict]  # Each: {"question": str, "correct": bool, "correct_answer": int/list, "user_answer": int/list, "explanation": str|None, "timeout": bool, "time_taken": float|None}


class QuizResponse(BaseModel):
    questions: List[QuizQuestion]
    role: str
    difficulty: str
    prompt: str
    explanations: Optional[bool] = False

SYSTEM_PROMPT = (
    "You are an expert quiz generator AI. Given a topic, target role (teacher, mentor, or student), and difficulty level, create a quiz with {num_questions} multiple-choice questions. "
    "Each question must include a 'text' field (the question), an 'options' field (a list of 4 answer choices), and an 'answer' field. "
    "The 'answer' field should be either a single integer (index of the correct option) or a list of integers (indices of all correct options for multi-answer questions). "
    "Return ONLY a valid JSON array of question objects with the fields: 'text', 'options', and 'answer'. "
    "Do not include any explanations or formatting unless the user requests explanations. "
    "If explanations are requested, include an 'explanation' field for each question with a concise explanation of the correct answer. The explanation field MUST be present if explanations are requested."
)

@app.post("/api/generate-quiz", response_model=QuizResponse, tags=["Quiz"], summary="Generate a quiz using Gemini")
async def generate_quiz(data: QuizRequest):
    """
    Generate a quiz using Gemini based on topic, role, and difficulty.
    Optionally specify number of questions, explanations, and model parameters.
    """
    logger.info(f"Generating quiz with Gemini: prompt='{data.prompt}', role='{data.role}', diff='{data.difficulty}', num_q={data.num_questions}")
    user_prompt = (
        f"Topic: {data.prompt}\nRole: {data.role}\nDifficulty: {data.difficulty}\n"
        f"Number of questions: {data.num_questions or 3}\n"
        + ("Include explanations for each answer." if data.explanations else "Generate a quiz as described.")
    )
    try:
        full_prompt = SYSTEM_PROMPT.format(num_questions=data.num_questions or 3) + "\n" + user_prompt
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        headers = {
            "Content-Type": "application/json",
            "X-goog-api-key": GEMINI_API_KEY
        }
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": full_prompt}
                    ]
                }
            ]
        }
        try:
            resp = requests.post(url, headers=headers, json=payload)
            resp.raise_for_status()
        except requests.exceptions.RequestException as e:
            logger.error(f"Gemini API request error: {e}")
            raise HTTPException(status_code=502, detail=f"Gemini API request error: {e}")
        try:
            gemini_data = resp.json()
        except json.JSONDecodeError as je:
            logger.error(f"Gemini response JSON decode error: {je}\nRaw response: {resp.text}")
            raise HTTPException(status_code=500, detail=f"Gemini response was not valid JSON: {je}")
        try:
            content = gemini_data["candidates"][0]["content"]["parts"][0]["text"]
        except KeyError as ke:
            logger.error(f"Gemini response parsing error: {ke}\nRaw response: {resp.text}")
            raise HTTPException(status_code=500, detail=f"Gemini response parsing error: {ke}")
        start = content.find('[')
        end = content.rfind(']') + 1
        if start == -1 or end == 0:
            logger.error(f"Failed to find JSON array in Gemini response: {content}")
            raise HTTPException(status_code=500, detail="Could not extract quiz JSON from Gemini response.")
        questions_json = content[start:end]
        try:
            questions = json.loads(questions_json)
        except json.JSONDecodeError as je:
            logger.error(f"JSON decode error: {je}\nRaw content: {content}")
            raise HTTPException(status_code=500, detail=f"Gemini response was not valid JSON: {je}")
        quiz_questions = []
        for q in questions:
            try:
                quiz_questions.append(QuizQuestion(**q))
            except ValidationError as ve:
                logger.error(f"QuizQuestion validation error: {ve}\nQuestion: {q}")
                continue
        if not quiz_questions:
            logger.error(f"No valid quiz questions parsed. Raw: {questions_json}")
            raise HTTPException(status_code=500, detail="No valid quiz questions generated.")
        return QuizResponse(
            questions=quiz_questions,
            role=data.role,
            difficulty=data.difficulty,
            prompt=data.prompt,
            explanations=data.explanations
        )
    except Exception as e:
        logger.error(f"Gemini API error: {e}")
        raise HTTPException(status_code=502, detail=f"Gemini API error: {e}")

from fastapi import Request
from collections import defaultdict
import time

# Simple in-memory rate limit per-IP (for demo)
RATE_LIMITS = defaultdict(list)
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX = 30     # max requests per window

@app.post("/api/submit-answers", response_model=SubmitAnswersResponse, tags=["Quiz"], summary="Submit quiz answers and get score/explanations")
async def submit_answers(data: SubmitAnswersRequest, request: Request):
    # --- Rate limiting ---
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    RATE_LIMITS[ip] = [t for t in RATE_LIMITS[ip] if now-t < RATE_LIMIT_WINDOW]
    if len(RATE_LIMITS[ip]) >= RATE_LIMIT_MAX:
        logger.warning(f"Rate limit exceeded for IP {ip}")
        raise HTTPException(status_code=429, detail="Too many requests. Please wait a minute and try again.")
    RATE_LIMITS[ip].append(now)
    # ---
    print('DEBUG: Received user_answers:', data.user_answers)
    total = len(data.questions)
    correct = 0
    wrong = 0
    results = []
    for idx, (q, user_ans) in enumerate(zip(data.questions, data.user_answers)):
        is_correct = False
        timeout = False
        time_taken = None
        # Support tuple: (answer, time_taken)
        if isinstance(user_ans, tuple) and len(user_ans)==2:
            ans, time_taken = user_ans
        else:
            ans = user_ans
        # Timeout/skipped
        if (ans is None or ans == -1) or (isinstance(q.answer, list) and (ans is None or (isinstance(ans, list) and len(ans) == 0))):
            timeout = True
            logger.info(f"Timeout: Question {idx+1} not answered.")
        elif isinstance(q.answer, list):
            # Multi-answer: compare by value
            if isinstance(ans, list):
                is_correct = set(ans) == set(q.answer)
            logger.info(f"Q{idx+1} MULTI: User: {ans}, Correct: {q.answer}, is_correct: {is_correct}")
        else:
            # Single-answer: compare by value
            is_correct = ans == q.answer
            logger.info(f"Q{idx+1} SINGLE: User: {ans}, Correct: {q.answer}, is_correct: {is_correct}")
        if is_correct:
            correct += 1
        else:
            wrong += 1
        results.append({
            "question": q.text,
            "correct": is_correct,
            "correct_answer": q.answer,
            "user_answer": ans,
            "explanation": q.explanation,
            "timeout": timeout,
            "time_taken": time_taken
        })
    print('DEBUG: Computed results:', results)
    return SubmitAnswersResponse(
        total=total,
        correct=correct,
        wrong=wrong,
        results=results
    )
