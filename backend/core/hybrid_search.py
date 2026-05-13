from rank_bm25 import BM25Okapi
from typing import List, Dict, Any

class HybridSearcher:
    def __init__(self, corpus_texts: List[str]):
        tokenized_corpus = [doc.split(" ") for doc in corpus_texts]
        self.bm25 = BM25Okapi(tokenized_corpus)
        self.corpus_texts = corpus_texts

    def get_top_n(self, query: str, n: int = 5) -> List[str]:
        tokenized_query = query.split(" ")
        return self.bm25.get_top_n(tokenized_query, self.corpus_texts, n=n)

# Note: This is session-specific, so it shouldn't be a global singleton
# unless it's managed per session.
