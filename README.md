# 🛡️ Web Security Checker

A lightweight, modern Full-Stack web application designed to evaluate domain security postures. It performs automated real-time checks on **SSL/TLS certificates** and **HTTP Security Headers**, rendering a dynamic security score along with actionable diagnostic metrics.

---

## 📌 Project Overview

When connecting to modern web applications, misconfigured transport security or missing HTTP headers leave users vulnerable to attacks such as **Man-in-the-Middle (MitM)**, **Clickjacking**, and **Cross-Site Scripting (XSS)**. 

This project provides a practical security dashboard that:
- Inspects SSL/TLS certificates for validity, issuer credentials, and expiration timelines.
- Analyzes HTTP response headers against OWASP security standards.
- Automatically handles HTTPS redirects to evaluate the final destination host.
- Computes an aggregate security rating based on standard compliance.

---

## 🏗️ Architecture & Tech Stack

The application is built using a decoupled **Client-Server Architecture**:

### **Backend**
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **HTTP Client:** `requests` (for HTTP header analysis & redirect tracking)
- **Networking/Crypto:** Native Python `socket` & `ssl` modules (for deep certificate inspection)
- **Validation:** Pydantic schemas

### **Frontend**
- **Framework:** [React](https://react.dev/) (bootstrapped with [Vite](https://vitejs.dev/))
- **UI & Icons:** Custom CSS with Lucide React icons (`lucide-react`)
- **API Integration:** Native Fetch API with asynchronous state management

---

## 🔍 Key Security Features & Metrics

1. **SSL/TLS Certificate Inspection:**
   - Establishes a direct socket connection to port 443.
   - Extracts and verifies certificate validity, issue dates, expiration dates, and remaining days.
   - Highlights certificate authority details (e.g., DigiCert, Let's Encrypt).

2. **HTTP Security Header Audit:**
   Tracks the final resolved URL after follows-redirect chain and checks for essential security headers:
   - `Strict-Transport-Security` (HSTS): Enforces HTTPS connections.
   - `Content-Security-Policy` (CSP): Mitigates XSS and data injection risks.
   - `X-Frame-Options`: Prevents Clickjacking attacks.
   - `X-Content-Type-Options`: Blocks MIME-sniffing.
   - `Referrer-Policy`: Controls referrer information leaks.

3. **Dynamic Scoring Engine:**
   - Starts with a base score of 100.
   - Deducts points for invalid/expiring certificates or missing critical headers.
   - Provides clear color-coded feedback (Green $\ge$ 80, Yellow $\ge$ 50, Red < 50).

---

## 🚀 Getting Started

### Prerequisites
- **Python** 3.10 or higher
- **Node.js** 18.x or higher & `npm`

---

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/web-security-checker.git
cd web-security-checker
```

#### 2. Backend Setup (FastAPI)
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv

# On Windows PowerShell:
.\venv\Scripts\Activate.ps1

# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn requests pydantic

# Run the development server
uvicorn main:app --reload
```
The FastAPI server will start running at `http://127.0.0.1:8000`.

#### 3. Frontend Setup (React + Vite)
Open a new terminal tab/window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
The React frontend will be available at `http://localhost:5173`.

---

## 🛠️ Project Structure

```text
mini-security-checker/
│
├── backend/
│   ├── main.py                  # FastAPI server entry point & scoring logic
│   └── modules/
│       ├── ssl_checker.py       # Low-level SSL socket checker
│       └── header_checker.py    # HTTP security headers analyzer
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main React Dashboard component
│   │   └── main.jsx             # React DOM entry point
│   └── package.json             # Frontend dependencies
│
└── README.md                    # Project documentation
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
