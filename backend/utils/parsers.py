import PyPDF2
import webvtt
import io

def extract_text_from_pdf(file_path):
    text = ""
    with open(file_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text()
    return text

def parse_vtt(file_path):
    text = ""
    try:
        for caption in webvtt.read(file_path):
            text += f"{caption.text} "
        return text.strip()
    except Exception:
        # Fallback for malformed VTT files (e.g. missing WEBVTT header)
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()

def read_txt(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

def get_parser(file_type):
    parsers = {
        'pdf': extract_text_from_pdf,
        'vtt': parse_vtt,
        'txt': read_txt
    }
    return parsers.get(file_type.lower())
