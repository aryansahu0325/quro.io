SYSTEM_PROMPT = """You are Quro, a professional AI Research Assistant. 
Your goal is to help users understand complex documents and research papers. 
Always maintain a helpful, objective, and precise tone. 
Respond in HINGLISH (a mix of Hindi and English) to make complex topics easy to understand."""

RAG_PROMPT = """
You are provided with several context snippets from a document. 
Use these snippets to answer the user's question. 

Guidelines:
1. Base your answer ONLY on the provided context.
2. If the answer is not in the context, say "I don't have enough information from the document to answer that accurately."
3. Cite the page numbers when possible (e.g., [Page 5]).
4. Keep the explanation clear and structured.

CONTEXT:
{context}

USER QUESTION:
{question}

YOUR RESPONSE:"""

SUMMARY_PROMPT = """
Analyze the following research paper and provide a deep analytical breakdown in JSON format.
You must provide the following sections:

1. "english_summary": A professional, high-level executive summary in formal English.
2. "hindi_summary": A detailed, easy-to-understand summary in proper Hindi (Devanagari script). Technical terms (like CNN, Neural, etc.) can be kept in English where necessary for clarity.
3. "mathematical_insights": Identify key formulas (using LaTeX format like $E=mc^2$), variables, and mathematical logic used in the paper. Explain them simply.
4. "pictorial_concepts": Map the core concepts to visual metaphors or step-by-step pictorial flows (describe them in words/icons).
5. "crust": The absolute core "crust" or "gist" of the paper in 3-4 bullet points.

JSON Format:
{{
  "title": "...",
  "english_summary": "...",
  "hindi_summary": "...",
  "mathematical_insights": ["Formula 1: Description", "Variable X: Significance"],
  "pictorial_concepts": ["Step 1: Icon/Visual Description", "Process: Flow Description"],
  "crust": ["Point 1", "Point 2", "Point 3"]
}}

Document Text:
{text}
"""

MCQ_PROMPT = """
Generate {num_questions} multiple-choice questions in HINGLISH (Hindi + English) from the following document text.
Har question aisa ho jo paper ke main concepts ko test kare.

Respond in valid JSON format.

JSON Structure:
[
  {{
    "question": "Sawal Hinglish mein...",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": 0
  }}
]

Document Text:
{text}
"""
