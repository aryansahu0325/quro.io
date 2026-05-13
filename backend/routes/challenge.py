from fastapi import APIRouter, Form
from services.llm_service import llm_service
from core.prompts import MCQ_PROMPT
from typing import Optional

router = APIRouter()

@router.post("/generate")
async def generate_challenge(
    text: str = Form(...),
    num_questions: int = Form(3)
):
    prompt = MCQ_PROMPT.format(text=text[:5000], num_questions=num_questions)
    questions = await llm_service.generate_json(prompt)
    return {"questions": questions}

@router.post("/evaluate")
async def evaluate_answer(
    question: str = Form(...),
    answer: str = Form(...),
    context: str = Form(...)
):
    prompt = f"Evaluate if this answer is correct based on the context.\nQuestion: {question}\nAnswer: {answer}\nContext: {context}"
    eval_result = await llm_service.generate_json(prompt + "\nRespond in JSON: {'correct': bool, 'feedback': '...'}")
    return eval_result
