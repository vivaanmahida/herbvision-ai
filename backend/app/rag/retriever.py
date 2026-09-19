"""
ChromaDB retriever for herb knowledge base.
Initializes the vector store on first call and retrieves relevant context.
"""
import os
from pathlib import Path

_chroma_client = None
_collection = None
_initialized = False


def _init_chroma():
    global _chroma_client, _collection, _initialized
    if _initialized:
        return
    try:
        import chromadb
        from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
        from app.rag.knowledge_base import build_herb_documents

        persist_dir = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
        Path(persist_dir).mkdir(parents=True, exist_ok=True)

        _chroma_client = chromadb.PersistentClient(path=persist_dir)
        embedding_fn = SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )

        try:
            _collection = _chroma_client.get_collection(
                name="herbs",
                embedding_function=embedding_fn
            )
            print(f"Loaded existing ChromaDB collection with {_collection.count()} documents.")
        except Exception:
            _collection = _chroma_client.create_collection(
                name="herbs",
                embedding_function=embedding_fn,
                metadata={"hnsw:space": "cosine"},
            )
            documents = build_herb_documents()
            _collection.add(
                ids=[d["id"] for d in documents],
                documents=[d["text"] for d in documents],
                metadatas=[d["metadata"] for d in documents],
            )
            print(f"Created ChromaDB collection and added {len(documents)} herb documents.")

        _initialized = True
    except Exception as e:
        print(f"ChromaDB init failed: {e}. Will use keyword fallback.")
        _initialized = True


def retrieve_context(query: str, herb_name: str = None, n_results: int = 3) -> str:
    """
    Retrieve relevant herb knowledge for a given query.
    Returns a combined context string.
    """
    _init_chroma()

    if _collection is not None:
        try:
            # If herb_name is known, bias the query toward that herb
            full_query = f"{herb_name} {query}" if herb_name else query
            where_filter = None
            if herb_name:
                # Try to find herb_id from the name
                from app.rag.knowledge_base import load_herbs_json
                herbs = load_herbs_json()
                herb_id = next((h["id"] for h in herbs if h["name"].lower() == herb_name.lower()), None)
                if herb_id:
                    where_filter = {"herb_id": herb_id}

            results = _collection.query(
                query_texts=[full_query],
                n_results=n_results,
                where=where_filter if where_filter else None,
            )
            docs = results.get("documents", [[]])[0]
            return "\n\n---\n\n".join(docs) if docs else ""
        except Exception as e:
            print(f"ChromaDB query error: {e}")

    # Keyword fallback
    return _keyword_fallback(query, herb_name)


def _keyword_fallback(query: str, herb_name: str = None) -> str:
    """Simple keyword-based retrieval from herb data as fallback."""
    from app.rag.knowledge_base import load_herbs_json
    herbs = load_herbs_json()
    query_lower = query.lower()

    best = None
    if herb_name:
        best = next((h for h in herbs if h["name"].lower() == herb_name.lower()), None)

    if not best:
        # Score by keyword overlap
        best_score = 0
        for herb in herbs:
            score = sum(1 for word in query_lower.split() if word in herb["name"].lower()
                        or word in herb.get("description", "").lower()
                        or any(word in tag for tag in herb.get("tags", [])))
            if score > best_score:
                best_score = score
                best = herb

    if not best:
        return ""

    herb = best
    dosha = herb.get("dosha", {})
    cultivation = herb.get("cultivation", {})
    return f"""Herb: {herb['name']} ({herb.get('scientific_name', '')})
Description: {herb.get('description', '')}
Traditional Uses: {', '.join(herb.get('traditional_uses', []))}
Dosha: Balances {', '.join(dosha.get('balances', []))}. Rasa: {dosha.get('rasa', '')}. Virya: {dosha.get('virya', '')}.
Habitat: {herb.get('habitat', '')}
Cultivation: {cultivation.get('climate', '')} climate. Soil: {cultivation.get('soil', '')}. Sunlight: {cultivation.get('sunlight', '')}.
Safety: {herb.get('safety_notes', '')}"""
