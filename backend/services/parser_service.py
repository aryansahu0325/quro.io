import fitz  # PyMuPDF
import pdfplumber
from services.ocr_service import ocr_service
import os
import tempfile
from typing import List, Dict, Any

class ParserService:
    def parse_pdf(self, file_path: str) -> str:
        """
        Multi-stage PDF parsing pipeline:
        1. PyMuPDF (fast, metadata-rich)
        2. pdfplumber (better table/layout handling)
        3. OCR (fallback for scanned docs)
        """
        # Stage 1: PyMuPDF
        text = self._parse_with_pymupdf(file_path)
        
        # Check if text is sufficient (not a scanned doc)
        if len(text.strip()) < 200:
            print("Insufficient text from PyMuPDF, trying pdfplumber...")
            text = self._parse_with_pdfplumber(file_path)
            
        # Stage 2: Check again, if still low, use OCR
        if len(text.strip()) < 100:
            print("Insufficient text from pdfplumber, falling back to OCR...")
            text = self._parse_with_ocr(file_path)
            
        return text

    def _parse_with_pymupdf(self, file_path: str) -> str:
        try:
            doc = fitz.open(file_path)
            text = ""
            for page in doc:
                text += page.get_text()
            return text
        except Exception:
            return ""

    def _parse_with_pdfplumber(self, file_path: str) -> str:
        try:
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            return text
        except Exception:
            return ""

    def _parse_with_ocr(self, file_path: str) -> str:
        try:
            doc = fitz.open(file_path)
            text = ""
            with tempfile.TemporaryDirectory() as temp_dir:
                for i, page in enumerate(doc):
                    pix = page.get_pixmap()
                    img_path = os.path.join(temp_dir, f"page_{i}.png")
                    pix.save(img_path)
                    text += ocr_service.extract_text_from_image(img_path) + "\n"
            return text
        except Exception as e:
            print(f"OCR Parsing Error: {e}")
            return ""

# Singleton instance
parser_service = ParserService()
