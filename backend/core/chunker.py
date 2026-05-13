from langchain.text_splitter import RecursiveCharacterTextSplitter
from typing import List, Dict, Any

class ChunkerService:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            is_separator_regex=False,
        )

    def create_chunks(self, text: str, metadata: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """
        Splits text into chunks and attaches metadata to each.
        """
        docs = self.splitter.create_documents([text])
        chunks = []
        for doc in docs:
            chunks.append({
                "text": doc.page_content,
                "metadata": metadata or {}
            })
        return chunks

# Singleton instance
chunker_service = ChunkerService()
