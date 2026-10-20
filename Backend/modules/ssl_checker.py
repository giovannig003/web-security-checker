import socket
import ssl
from datetime import datetime, timezone

def check_ssl(hostname: str) -> dict:
    """
    Si connette al server HTTPS e analizza il certificato SSL/TLS.
    """
    hostname = hostname.replace("https://", "").replace("http://", "").split('/')[0]
    context = ssl.create_default_context()
    
    try:
        with socket.create_connection((hostname, 443), timeout=5) as sock:
            with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                cert = ssock.getpeercert()
                
                # Estrazione e conversione data con fuso orario UTC
                not_after_str = cert['notAfter']
                expire_date = datetime.strptime(not_after_str, '%b %d %H:%M:%S %Y %Z').replace(tzinfo=timezone.utc)
                days_until_expire = (expire_date - datetime.now(timezone.utc)).days
                
                issuer = dict(x[0] for x in cert['issuer'])
                organization_name = issuer.get('organizationName', 'Sconosciuto')
                
                return {
                    "valid": True,
                    "days_until_expire": days_until_expire,
                    "expire_date": expire_date.strftime('%Y-%m-%d'),
                    "issuer": organization_name,
                    "error": None
                }
                
    except Exception as e:
        return {
            "valid": False,
            "days_until_expire": 0,
            "expire_date": None,
            "issuer": None,
            "error": str(e)
        }

if __name__ == "__main__":
    # Puoi cambiare qui il sito da testare!
    test_domain = "google.com"  # <--- Prova a mettere un qualsiasi sito web qui
    result = check_ssl(test_domain)
    print(f"\nRisultato SSL per {test_domain}:", result)