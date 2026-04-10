# CoffeeGuard Backend: System Architecture & Core Concepts

The CoffeeGuard backend is a specialized API designed to identify coffee leaf diseases and track their geographic spread across Kenyan farms. Built with **FastAPI**, it prioritizes high performance, strict data validation, and advanced geospatial querying.

---

## 1. Geospatial Data Strategy: SQLite + SpatiaLite
Standard databases are designed for text and numbers, but they struggle with "spatial" questions like "Is this farm near an outbreak?" Instead of the overhead of MongoDB, we utilize **SQLite** with the **SpatiaLite** extension.

* **The Concept:** SpatiaLite transforms a standard database file into a Geographic Information System (GIS). It allows the database to store binary geometry and calculate distances using real-world coordinates.
* **Implementation:** We bootstrap the database using `InitSpatialMetaData(1)`, which creates the internal system catalog needed to handle GPS data.

## 2. Standardized Location: GeoJSON
To ensure the React frontend and the Python backend speak the same language regarding maps, we strictly follow the **GeoJSON** standard.

* **The Structure:** A location is stored as a **Point** with a coordinate pair: `[longitude, latitude]`.
* **The "SRID 4326" Rule:** We use the WGS84 coordinate system (the same one used by Global Positioning Systems). This ensures our map pins align perfectly with real-world satellite imagery.

## 3. Spatial Math: Proximity Querying
One of our core features is the **Outbreak Map**. To find nearby reports without scanning every single record in the database, we use spatial indexing.

* **Function:** We use `ST_Distance` to perform radius searches.
* **Logic:** The API takes a user's current GPS location and a radius (e.g., 20km) and returns every disease report whose "location" falls within that mathematical circle.

## 4. Security: Passwordless OTP & JWT
CoffeeGuard uses a "Passwordless" flow to reduce friction for users while maintaining high security.

* **The OTP (One-Time Password):** Users register or log in using only their email. The system generates a 6-digit code, prints it to the terminal (for development), and stores it temporarily.
* **The JWT (JSON Web Token):** Once the code is verified, the backend issues a **JWT**. This token acts as a secure, signed "wristband." The frontend attaches this token to every request, allowing our **Middleware** to verify the user's identity without asking for a password again.

## 5. AI Integration: The Reverse Proxy
The AI service is a separate specialized worker running **TensorFlow**. To maintain a clean architecture, the backend acts as a **Reverse Proxy**.

* **The Flow:** The frontend sends a leaf image to the main API (:5000). The main API forwards that image to the AI Service (:8000), waits for the prediction (e.g., 'rust', 'miner'), and returns the result to the user.
* **The Benefit:** This shields the AI model from the public internet and centralizes all security checks (JWT verification) in one place.

## 6. Data Integrity: Pydantic Gatekeepers
Every piece of data entering our system must pass through a **Pydantic Schema**.

* **Validation:** If a user tries to send a string where we expect a number, or an invalid email format, Pydantic rejects the request before it ever reaches our logic.
* **Serialization:** These schemas also ensure that sensitive data (like hidden OTP codes or internal database IDs) is never accidentally sent back to the frontend.

---

This documentation provides the conceptual framework for the API.