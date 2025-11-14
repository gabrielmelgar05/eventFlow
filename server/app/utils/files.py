# utils/files.py

from pathlib import Path
from fastapi import UploadFile
from uuid import uuid4

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def save_upload(file: UploadFile) -> str:
    ext = Path(file.filename or "").suffix.lower() or ".bin"
    name = f"{uuid4().hex}{ext}"
    dest = UPLOAD_DIR / name
    with dest.open("wb") as f:
        f.write(file.file.read())
    return str(dest)
