from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from modules.ssl_checker import check_ssl
from modules.header_checker import check_headers

app = FastAPI(
    title="Web Security Checker API",
    description="API REST per la verifica di sicurezza SSL e Header HTTP",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    url: str

def normalize_url(url: str) -> str:
    url = url.strip().lower()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    return url

def calculate_score(ssl_res: dict, header_res: dict) -> int:
    score = 100
    if not ssl_res.get("valid"):
        score -= 50
    elif ssl_res.get("days_until_expire", 0) < 30:
        score -= 15
        
    missing_count = len(header_res.get("missing_headers", []))
    score -= (missing_count * 10)
    return max(0, score)

@app.get("/")
def home():
    return {"message": "API Web Security Checker attive e funzionanti!"}

@app.post("/api/scan")
def scan_website(request: ScanRequest):
    target = normalize_url(request.url)
    
    ssl_res = check_ssl(target)
    header_res = check_headers(target)
    score = calculate_score(ssl_res, header_res)
    
    return {
        "target": target,
        "score": score,
        "ssl": ssl_res,
        "headers": header_res
    }