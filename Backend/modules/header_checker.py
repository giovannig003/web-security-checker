import requests

def check_headers(url: str) -> dict:
    security_headers = [
        "Strict-Transport-Security",
        "X-Frame-Options",
        "X-Content-Type-Options",
        "Content-Security-Policy",
        "Referrer-Policy"
    ]

    headers_request = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers_request, timeout=8, allow_redirects=True)
        final_headers = response.headers

        present = {}
        missing = []

        normalized_found = {k.lower(): v for k, v in final_headers.items()}

        for header in security_headers:
            if header.lower() in normalized_found:
                present[header] = normalized_found[header.lower()]
            else:
                missing.append(header)

        return {
            "status_code": response.status_code,
            "final_url": response.url,
            "present_headers": present,
            "missing_headers": missing,
            "error": None
        }

    except requests.RequestException as e:
        return {
            "status_code": None,
            "final_url": url,
            "present_headers": {},
            "missing_headers": security_headers,
            "error": str(e)
        }