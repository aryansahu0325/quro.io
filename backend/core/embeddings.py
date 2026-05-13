from sentence_transformers import SentenceTransformer
from config import settings
import torch
import numpy as np
from typing import List

class EmbeddingService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL, device=self.device)
        
    def embed_text(self, text: str) -> List[float]:
        """Embed a single piece of text."""
        embedding = self.model.encode(text, normalize_embeddings=True)
        return embedding.tolist()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a batch of documents."""
        embeddings = self.model.encode(texts, normalize_embeddings=True)
        return embeddings.tolist()

    @property
    def vector_size(self) -> int:
        return self.model.get_sentence_embedding_dimension()

# Singleton instance
embedding_service = EmbeddingService()
