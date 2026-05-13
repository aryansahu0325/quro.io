from core.vector_store import vector_store
from services.llm_service import llm_service
from core.prompts import RAG_PROMPT, SYSTEM_PROMPT
from typing import List, Dict, Any, AsyncGenerator

class RAGService:
    async def answer_question(self, question: str, session_id: str) -> AsyncGenerator[str, None]:
        """
        RAG Pipeline:
        1. Search vector store (Qdrant)
        2. Format context
        3. Stream response from Groq
        """
        # Retrieve context
        results = vector_store.search(question, session_id, limit=5)
        
        if not results:
            yield "I couldn't find any relevant information in the uploaded document to answer your question."
            return

        context = "\n\n".join([
            f"--- Context (Page {r['metadata'].get('page', 'Unknown')}) ---\n{r['text']}"
            for r in results
        ])
        
        # Prepare citations for the frontend (we'll send them at the end or via metadata)
        # For now, let's just use the RAG prompt which includes context.
        
        prompt = RAG_PROMPT.format(context=context, question=question)
        
        async for chunk in llm_service.generate_response(prompt, SYSTEM_PROMPT):
            yield chunk

# Singleton instance
rag_service = RAGService()
