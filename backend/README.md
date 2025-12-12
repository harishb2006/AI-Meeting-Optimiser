# AI Meeting Optimiser Backend

## Features

✅ **Task & Decision Extraction** - Uses Gemini API to extract tasks, decisions, assignees, priorities, and deadlines  
✅ **Meeting Summarization** - LLM generates concise summaries for managers  
✅ **RAG/Retrieval** - ChromaDB stores meetings for future queries like "Who is responsible for Task X?"  
✅ **Google Sheets Export** - Automate task tracking by exporting to Google Sheets  
✅ **Excel Export** - Generate Excel files with meeting analysis  
✅ **LangChain Integration** - Uses LangChain for robust LLM orchestration  

## Setup

### 1. Install Dependencies

```bash
cd backend
source venv/bin/activate  # Or: venv/bin/python
pip install fastapi uvicorn google-generativeai python-dotenv langchain langchain-google-genai chromadb gspread oauth2client openpyxl
```

### 2. Configure Environment

Create a `.env` file:
```
GEMINI_API_KEY=AIzaSyBdBQ42u2fziBniXyYCunHAWyxre4wQz2s
```

### 3. (Optional) Google Sheets Setup

For Google Sheets export functionality:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google Sheets API** and **Google Drive API**
4. Create **Service Account** credentials
5. Download the JSON key file
6. Rename it to `credentials.json` and place in `backend/` directory

## Running the Server

```bash
cd backend
venv/bin/python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Or using Python directly:
```bash
venv/bin/python main.py
```

Server will start at: `http://localhost:8000`

## API Endpoints

### 1. Analyze Meeting Transcript
**POST** `/api/analyze`

Extracts tasks, decisions, summary and stores in ChromaDB for RAG.

**Request:**
```json
{
  "transcript": "Meeting transcript text...",
  "meeting_title": "Q1 Planning Meeting"
}
```

**Response:**
```json
{
  "meeting_title": "Q1 Planning Meeting",
  "summary": "Brief meeting summary...",
  "tasks": [
    {
      "task": "Complete API integration",
      "assignee": "John",
      "deadline": "Next Friday",
      "priority": "High"
    }
  ],
  "decisions": [
    {
      "decision": "Use microservices architecture",
      "rationale": "Better scalability"
    }
  ],
  "follow_ups": ["Schedule review meeting"]
}
```

### 2. Query Past Meetings (RAG)
**POST** `/api/query`

Ask questions about past meetings using RAG.

**Request:**
```json
{
  "query": "Who is responsible for the API integration task?"
}
```

**Response:**
```json
{
  "answer": "John is responsible for completing the API integration by next Friday.",
  "relevant_meetings": [
    {
      "meeting_title": "Q1 Planning Meeting",
      "date": "2025-12-12T...",
      "num_tasks": 5,
      "num_decisions": 3
    }
  ]
}
```

### 3. Export to Google Sheets
**POST** `/api/export/sheets`

Export meeting analysis to Google Sheets.

**Request:**
```json
{
  "meeting_title": "Q1 Planning Meeting",
  "summary": "...",
  "tasks": [...],
  "decisions": [...],
  "spreadsheet_id": "optional-existing-sheet-id"
}
```

### 4. Export to Excel
**POST** `/api/export/excel`

Generate Excel file with meeting analysis.

### 5. Health Check
**GET** `/health`

Returns system status and configuration.

## Example Usage

```bash
# Analyze meeting
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "John: Let'\''s prioritize the API work. Sarah: I'\''ll handle the frontend.",
    "meeting_title": "Sprint Planning"
  }'

# Query past meetings
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What tasks were assigned to Sarah?"}'
```

## Architecture

- **FastAPI**: REST API framework
- **LangChain**: LLM orchestration and chaining
- **Gemini API**: AI model for extraction and summarization
- **ChromaDB**: Vector database for RAG functionality
- **Google Sheets API**: Export automation
- **OpenPyXL**: Excel file generation
