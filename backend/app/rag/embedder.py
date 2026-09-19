"""
Gemini-powered RAG answer generation.
Uses retrieved herb context from ChromaDB + Google Gemini API (google-genai SDK).
Model priority: gemini-2.0-flash-lite -> gemini-2.5-flash-lite -> gemini-flash-latest
"""
import os
from app.rag.retriever import retrieve_context

_gemini_client = None
_gemini_loaded = False

# Model priority list — tries each in order until one works
GEMINI_MODEL_PRIORITY = [
    "gemini-2.0-flash-lite",
    "gemini-2.0-flash-lite-001",
    "gemini-2.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-2.0-flash-001",
    "gemini-flash-latest",
]


def _get_gemini():
    global _gemini_client, _gemini_loaded
    if _gemini_loaded:
        return _gemini_client
    api_key = os.getenv("GEMINI_API_KEY", "")
    _gemini_loaded = True
    if not api_key:
        print("[WARN] No GEMINI_API_KEY set - using template fallback.")
        return None
    try:
        from google import genai
        _gemini_client = genai.Client(api_key=api_key)
        print("[OK] Gemini client initialized (google-genai SDK).")
        return _gemini_client
    except Exception as e:
        print(f"[ERROR] Gemini init failed: {e}")
        return None


def _call_gemini(client, prompt: str) -> str:
    """Try each model in priority order until one succeeds."""
    last_error = None
    for model_name in GEMINI_MODEL_PRIORITY:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )
            print(f"[OK] Gemini answered using model: {model_name}")
            return response.text.strip()
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                print(f"  -> {model_name}: quota exhausted, trying next...")
                last_error = e
                continue
            elif "404" in err_str or "NOT_FOUND" in err_str:
                print(f"  -> {model_name}: not found, trying next...")
                last_error = e
                continue
            else:
                print(f"  -> {model_name}: error - {e}")
                last_error = e
                break
    raise last_error or Exception("All Gemini models failed")


SYSTEM_PROMPT = """You are HerbVision AI's Ayurvedic Knowledge Assistant — a specialized expert in Ayurvedic medicinal herbs.

Your role:
- Answer questions ONLY using the provided herb knowledge context below.
- Keep answers educational, accurate, and grounded in Ayurvedic tradition.
- Always remind users this information is for educational purposes only and not medical advice.
- If the context doesn't contain enough information to answer the question, say: "I couldn't find verified information for that query in my knowledge base. Please consult a qualified Ayurvedic practitioner."
- Never hallucinate or make up information not present in the context.
- Be warm, knowledgeable, and approachable in tone.
- Format responses with clear paragraphs. Keep responses concise (under 200 words unless a detailed comparison is needed).
- Use emoji sparingly to make responses friendly (🌿 for herbs, ⚠️ for warnings, 🙏 for Namaste).

CONTEXT FROM HERB KNOWLEDGE BASE:
{context}

USER QUESTION: {question}

Remember: Educational purposes only. Do not provide personalized medical advice."""


def generate_answer(query: str, herb_name: str = None) -> dict:
    """
    Generate a RAG-grounded answer using Gemini + ChromaDB retrieval.
    Returns dict with answer, sources, and herb_name.
    """
    context = retrieve_context(query, herb_name=herb_name, n_results=3)

    if not context:
        return {
            "answer": "I couldn't find verified information for that query in my knowledge base. Please consult a qualified Ayurvedic practitioner.",
            "sources": [],
            "herb_name": herb_name,
        }

    # Extract which herbs were retrieved for source attribution
    sources = []
    if "Herb:" in context:
        for line in context.split("\n"):
            if line.startswith("Herb:"):
                herb_part = line.replace("Herb:", "").strip().split("(")[0].strip()
                if herb_part and herb_part not in sources:
                    sources.append(herb_part)

    client = _get_gemini()
    answer = None

    if client:
        try:
            prompt = SYSTEM_PROMPT.format(context=context, question=query)
            answer = _call_gemini(client, prompt)
        except Exception as e:
            print(f"All Gemini models exhausted/failed: {e}")
            answer = None

    if not answer:
        answer = _template_answer(query, context, herb_name)

    return {
        "answer": answer,
        "sources": sources if sources else ([herb_name] if herb_name else []),
        "herb_name": herb_name,
    }


def _template_answer(query: str, context: str, herb_name: str = None) -> str:
    """Fallback template-based answer extraction from context."""
    q_lower = query.lower()
    lines = context.split("\n")

    # Try to find the most relevant lines
    relevant = []
    keywords = [w for w in q_lower.split() if len(w) > 3]
    for line in lines:
        if any(kw in line.lower() for kw in keywords):
            relevant.append(line.strip())

    if relevant:
        base = "\n".join(relevant[:5])
        return f"🌿 Based on our Ayurvedic knowledge base:\n\n{base}\n\n⚠️ This information is for educational purposes only. Please consult a qualified Ayurvedic practitioner for personalized guidance."

    # Generic context summary
    first_block = context[:600]
    return f"🌿 Here's what I found about {'**' + herb_name + '**' if herb_name else 'that herb'} in our knowledge base:\n\n{first_block}...\n\n⚠️ For educational purposes only. Consult a qualified Ayurvedic practitioner."
