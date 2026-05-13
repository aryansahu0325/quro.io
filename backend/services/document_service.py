from services.parser_service import parser_service
from core.chunker import chunker_service
from core.vector_store import vector_store
from services.llm_service import llm_service
from core.prompts import SUMMARY_PROMPT
import os
import tempfile
from typing import Dict, Any

class DocumentService:
    async def process_document(self, file_content: bytes, filename: str, session_id: str) -> Dict[str, Any]:
        """
        Process a document: Parse -> Chunk -> Embed -> Summarize.
        """
        print(f"DEBUG: Processing started for {filename}")
        suffix = os.path.splitext(filename)[1]
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
            temp.write(file_content)
            temp_path = temp.name

        try:
            # 1. Parse
            print("DEBUG: Phase 1 - Parsing PDF...")
            text = parser_service.parse_pdf(temp_path)
            print(f"DEBUG: Parsed {len(text)} characters")
            
            # 2. Chunk
            print("DEBUG: Phase 2 - Chunking text...")
            chunks = chunker_service.create_chunks(text, metadata={"filename": filename})
            print(f"DEBUG: Created {len(chunks)} chunks")
            
            # 3. Embed & Vector Store
            print("DEBUG: Phase 3 - Upserting to Vector Store...")
            vector_store.upsert_chunks(chunks, session_id)
            print("DEBUG: Upsert complete")
            
            # 4. Summarize (first 4000 chars for summary)
            print("DEBUG: Phase 4 - Generating Summary...")
            summary_prompt = SUMMARY_PROMPT.format(text=text[:4000])
            summary_json = await llm_service.generate_json(summary_prompt)
            print("DEBUG: Summary generation complete")
            
            return {
                "summary": summary_json,
                "text_preview": text[:1000],
                "filename": filename,
                "chunks_count": len(chunks)
            }
        except Exception as e:
            print(f"ERROR in DocumentService: {str(e)}")
            import traceback
            traceback.print_exc()
            raise e
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

# Singleton instance
document_service = DocumentService()
