from groq import AsyncGroq
from config import settings
from typing import AsyncGenerator, List, Dict, Optional
import json

class LLMService:
    def __init__(self):
        self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)
        self.primary_model = settings.PRIMARY_MODEL
        self.fallback_model = settings.FALLBACK_MODEL

    async def generate_response(
        self, 
        prompt: str, 
        system_prompt: str = "You are a helpful AI assistant.",
        stream: bool = True
    ) -> AsyncGenerator[str, None]:
        """
        Generates a streaming response using Groq.
        """
        try:
            stream_response = await self.client.chat.completions.create(
                model=self.primary_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                stream=True,
            )
            
            async for chunk in stream_response:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            # Fallback logic could go here
            print(f"Error in LLM service: {e}")
            yield f"⚠️ Error generating response: {str(e)}"

    async def generate_json(
        self, 
        prompt: str, 
        system_prompt: str = "You are a helpful AI assistant that only responds in valid JSON."
    ) -> Dict:
        """
        Generates a non-streaming JSON response.
        """
        try:
            response = await self.client.chat.completions.create(
                model=self.primary_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Error in LLM JSON generation: {e}")
            return {"error": str(e)}

# Singleton instance
llm_service = LLMService()
