# AI Quiz Backend (FastAPI)

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure API Key:**
   - Add your Gemini API key to `.env` (see Gemini API documentation).

3. **Run the server:**
   ```bash
   uvicorn main:app --reload
   ```

## Endpoint

### POST `/api/generate-quiz`
**Request JSON:**
```
{
  "prompt": "string",
  "role": "teacher|mentor|student",
  "difficulty": "easy|medium|hard"
}
```
**Response JSON:**
```
{
  "questions": [
    { "text": "...", "options": ["..."], "answer": 1 }
  ],
  "role": "...",
  "difficulty": "...",
  "prompt": "..."
}
```
