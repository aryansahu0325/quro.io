import asyncio
from core.vector_store import vector_store
from qdrant_client.http import models
from services.llm_service import llm_service
from config import settings
from typing import Dict, Any, List, AsyncGenerator
import json

VALIDATION_PROMPT = """
You are an academic compliance bot. Analyze this document text extract and determine if it represents a valid academic research paper, scientific paper, or scholarly article (e.g. has an abstract, introduction, methodology, formal structure, references, or scholarly tone).

If the text is NOT a research paper (for example, it is a shopping receipt, personal chat, invoice, python code file, generic spam, recipe, or completely non-academic document), classify it as NOT a research paper.

Respond ONLY in valid JSON.

JSON Format:
{{
  "is_research_paper": true,
  "confidence": 0.95,
  "domain": "Computer Science",
  "reason": "This document has a structured abstract, introduction, and academic tone."
}}
or if invalid:
{{
  "is_research_paper": false,
  "confidence": 0.99,
  "domain": "None",
  "reason": "The text lacks scholarly structure, academic citations, or an abstract."
}}

Document Extract (Filename: {filename}):
{text}
"""

SYNTHESIS_PROMPT = """
You are Quro, a Senior Research Synthesizer. You are analyzing the following research papers that are uploaded together in a workspace session.

Uploaded Papers:
{papers_meta}

Your goals are:
1. Determine if there is a common relationship, overlap, or theme among these papers.
2. Synthesize their relationship, explaining how they relate to each other, complement each other, or address a similar core problem (Hinglish/English mix is highly encouraged for explanations, keeping the tone objective and extremely precise).
3. Extract the "Important Crust"—a list of 4-6 high-impact consolidated insights, joint breakthroughs, or takeaways across all these papers combined.
4. List their common themes, shared methodologies, and intersecting academic domains.

Respond ONLY in valid JSON format.

JSON Structure:
{{
  "has_relationship": true,
  "relationship_summary": "Explain how they are related in HINGLISH...",
  "shared_methodologies": ["Method 1", "Method 2"],
  "important_crust": ["Insight 1 in Hinglish", "Insight 2 in Hinglish", "Insight 3 in Hinglish"],
  "common_themes": ["Theme 1", "Theme 2"],
  "academic_domains": ["Domain 1", "Domain 2"]
}}

Papers Text Extracts:
{papers_text}
"""

CO_WRITE_PROMPT = """
You are Quro, an expert AI Research Co-Writer.
Your goal is to write a comprehensive 'Short Research Paper' on the user's requested topic: '{topic}'.
You must base your paper on the provided reference contexts from the user's uploaded research papers.

Guidelines:
1. Write a highly professional, well-structured short research paper.
2. Structure your paper with clear sections:
   - **Title**: A creative and professional title.
   - **Abstract**: A concise summary of the topic and synthesized findings.
   - **Introduction**: Overview of the topic and its importance.
   - **Synthesis & Literature Review**: Synthesizing the ideas from the references and explaining how they relate to the topic.
   - **In-depth Analysis & Discussion**: Deep dive analysis citing the references.
   - **Conclusion**: Summarize findings and future outlook.
   - **References**: List the source papers referenced, using an academic citation format:
     [1] Filename - Title
3. Cite references in the text (like [1], [2]) when referencing facts or ideas from the context.
4. Keep the tone academic, objective, and precise, but explain complex terms in a very engaging Hinglish/English hybrid style where helpful for conceptual clarity, maintaining highly professional markdown structure.
5. Base the content strictly on the context below. Do not make up facts that are not present.

REFERENCE CONTEXT:
{context}

USER REQUESTED TOPIC:
{topic}

YOUR STREAMING RESPONSE:
"""

class SynthesisService:
    async def get_session_chunks(self, session_id: str) -> List[Dict[str, Any]]:
        """
        Fetch all chunks for a given session from Qdrant.
        """
        chunks = []
        offset = None
        
        # Safe limit up to 250 chunks (approx 4-5 research papers)
        try:
            scroll_result, next_page_offset = vector_store.client.scroll(
                collection_name=settings.VECTOR_COLLECTION,
                scroll_filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="session_id",
                            match=models.MatchValue(value=session_id)
                        )
                    ]
                ),
                limit=250,
                offset=offset,
                with_payload=True,
                with_vectors=False
            )
            for hit in scroll_result:
                payload = hit.payload or {}
                chunks.append({
                    "text": payload.get("text", ""),
                    "filename": payload.get("filename", "Unknown"),
                    "page": payload.get("page", 1)
                })
        except Exception as e:
            print(f"Error fetching chunks from Qdrant: {e}")
            
        return chunks

    async def validate_and_synthesize(self, session_id: str) -> Dict[str, Any]:
        """
        1. Group chunks by filename.
        2. Validate each paper is a valid academic document using LLM.
        3. If any is invalid, return invalid status and details.
        4. If all valid, perform multi-paper relationship synthesis and return insights.
        """
        chunks = await self.get_session_chunks(session_id)
        if not chunks:
            return {
                "success": False,
                "status": "empty",
                "message": "No documents found in this session. Please upload some papers first."
            }

        # Group by filename
        papers = {}
        for chunk in chunks:
            fname = chunk["filename"]
            if fname not in papers:
                papers[fname] = []
            papers[fname].append(chunk)

        # Sort chunks inside each paper by page
        for fname in papers:
            papers[fname].sort(key=lambda x: x.get("page", 1))

        # Reconstruct first ~7500 characters of each paper to validate
        paper_extracts = {}
        for fname, p_chunks in papers.items():
            text_extract = ""
            for ch in p_chunks[:15]:
                text_extract += ch["text"] + "\n"
            paper_extracts[fname] = text_extract[:7500]

        # Validate in parallel
        async def validate_single_paper(filename: str, text: str) -> Dict[str, Any]:
            prompt = VALIDATION_PROMPT.format(filename=filename, text=text)
            res = await llm_service.generate_json(
                prompt,
                system_prompt="You are an academic compliance bot that outputs strictly valid JSON."
            )
            return {"filename": filename, "validation": res}

        validation_tasks = [
            validate_single_paper(fname, text)
            for fname, text in paper_extracts.items()
        ]
        
        validation_results = await asyncio.gather(*validation_tasks)
        
        invalid_papers = []
        for result in validation_results:
            val = result["validation"]
            # Fallback handling in case of LLM errors
            is_valid = val.get("is_research_paper", True)
            if not is_valid:
                invalid_papers.append({
                    "filename": result["filename"],
                    "reason": val.get("reason", "Does not conform to academic research standards.")
                })

        if invalid_papers:
            return {
                "success": False,
                "status": "invalid_domain",
                "message": "One or more uploaded files are not connected with this domain / do not look like research papers.",
                "invalid_papers": invalid_papers
            }

        # If all valid, run Synthesis!
        papers_meta = "\n".join([f"- {fname}" for fname in paper_extracts.keys()])
        papers_text_combined = ""
        for fname, text in paper_extracts.items():
            papers_text_combined += f"\n--- Paper: {fname} ---\n{text[:4000]}\n"

        synthesis_prompt = SYNTHESIS_PROMPT.format(
            papers_meta=papers_meta,
            papers_text=papers_text_combined
        )

        synthesis_res = await llm_service.generate_json(
            synthesis_prompt,
            system_prompt="You are an academic synthesizer that outputs strictly valid JSON."
        )

        return {
            "success": True,
            "status": "synthesized",
            "synthesis": synthesis_res,
            "papers": list(paper_extracts.keys())
        }

    async def stream_co_write_paper(self, session_id: str, topic: str) -> AsyncGenerator[str, None]:
        """
        1. Retrieve top 15 relevant chunks from Qdrant using the 'topic'.
        2. Combine into a comprehensive reference context.
        3. Call LLM to stream generation of the co-written short research paper.
        """
        # Search chunks across session
        try:
            results = vector_store.search(topic, session_id, limit=15)
        except Exception as e:
            print(f"Error searching vector store for co-writing: {e}")
            results = []

        if not results:
            yield "No relevant content found in the uploaded papers. Try expanding your topic or uploading more papers."
            return

        # Format context
        context_items = []
        for r in results:
            filename = r["metadata"].get("filename", "Reference Doc")
            page = r["metadata"].get("page", "Unknown")
            context_items.append(f"--- Context from paper [{filename}] (Page {page}) ---\n{r['text']}")
        
        context = "\n\n".join(context_items)

        prompt = CO_WRITE_PROMPT.format(context=context, topic=topic)

        # Generate stream
        async for chunk in llm_service.generate_response(
            prompt, 
            system_prompt="You are a professional academic research assistant that writes short, citations-backed research papers."
        ):
            yield chunk

# Singleton instance
synthesis_service = SynthesisService()
