# CoffeeGuard Backend

CoffeeGuard is the core API service designed to identify coffee leaf diseases and track outbreaks across Kenyan farms. This backend handles user authentication via passwordless OTP, manages geospatial disease reports, and provides a secure proxy to the AI prediction service.

---

## 🛠 Tech Stack
* **Framework:** FastAPI (Python 3.12+)
* **Database:** SQLite + SpatiaLite (Geospatial support)
* **ORM:** SQLAlchemy + GeoAlchemy2
* **Security:** JWT (JSON Web Tokens) with OTP verification
* **Validation:** Pydantic

---

## 🏗 Prerequisites

### SpatiaLite Installation
This project requires the SpatiaLite binary to handle geographic coordinates. Install the version for your operating system:

* **Windows:** 1. Download the `mod_spatialite` binaries from [Gaia-GIS](http://www.gaia-gis.it/gaia-sins/windows-bin-amd64/).
    2. Extract the `.dll` files directly into the root folder of this project.
* **macOS:**
    ```bash
    brew install libspatialite
    ```
* **Linux / WSL:**
    ```bash
    sudo apt-get update && sudo apt-get install libsqlite3-mod-spatialite
    ```

---

## 🚀 Getting Started

### 1. Environment Setup
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configuration
Create a `.env` file in the root directory and add the following:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=10080
AI_SERVICE_URL=http://localhost:8000
```

### 3. Launching the Server
```bash
uvicorn app.main:app --reload --port 5000
```

---

## 📂 Project Structure
* `app/api/`: API route controllers and dependencies.
* `app/models/`: SQLAlchemy database models.
* `app/schemas/`: Pydantic data validation schemas.
* `app/core/`: Security logic, JWT handling, and database engine setup.
* `docs/`: Detailed project documentation.
    * `ARCHITECTURE.md`: Technical concepts and geospatial design.
    * `API.md`: Comprehensive endpoint references and payloads.

---

## 🛡 Authentication Flow
CoffeeGuard uses a passwordless authentication system:
1.  **Request OTP:** The user provides an email and receives a 6-digit code.
2.  **Verify OTP:** The user submits the code to receive a JWT access token.
3.  **Authorized Access:** The token must be included in the `Authorization: Bearer <token>` header for all protected routes.