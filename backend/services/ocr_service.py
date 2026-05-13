import pytesseract
from PIL import Image
import os
from config import settings
from typing import List

class OCRService:
    def __init__(self):
        # Configure tesseract path if needed
        # pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD
        pass

    def extract_text_from_image(self, image_path: str) -> str:
        """Extract text from a single image."""
        try:
            return pytesseract.image_to_string(Image.open(image_path))
        except Exception as e:
            print(f"OCR Error: {e}")
            return ""

    def process_images(self, image_paths: List[str]) -> str:
        """Process multiple images and combine text."""
        full_text = []
        for path in image_paths:
            text = self.extract_text_from_image(path)
            if text:
                full_text.append(text)
        return "\n\n".join(full_text)

# Singleton instance
ocr_service = OCRService()
