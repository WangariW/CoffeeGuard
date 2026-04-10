# CoffeeGuard API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api`  
**AI Service Proxy:** `http://localhost:8000/predict`

-----

## Table of Contents

 * [Authentication](#authentication)
* [Disease Reports](#disease-reports)
* [AI Prediction](#ai-prediction)
* [User Profile](#user-profile)
* [Data Structures](#data-structures)
* [Environment Configuration](#environment-configuration)

-----

## Authentication

CoffeeGuard uses a passwordless OTP (One-Time Password) system for login and registration.

### 1\. Request OTP

Initiates the login or registration process by generating a 6-digit code.

  * **Endpoint:** `POST /auth/request-otp`
  * **Payload:**
    ```json
    { "email": "farmer@example.com" }
    ```
  * **Success Response:** `200 OK`
  * **Note:** During development, the OTP is printed directly to the backend terminal.

### 2\. Verify OTP

Verifies the code and returns a JSON Web Token (JWT).

  * **Endpoint:** `POST /auth/verify-otp`
  * **Payload:**
    ```json
    {
      "email": "farmer@example.com",
      "otp": "123456"
    }
    ```
  * **Success Response:** `200 OK`
    ```json
    {
      "access_token": "eyJhbG...",
      "token_type": "bearer"
    }
    ```

-----

## Disease Reports

All report endpoints require a valid JWT in the `Authorization` header.

### 1\. Create Report

Saves a new disease detection result with spatial data.

  * **Endpoint:** `POST /reports/create`
  * **Payload:**
    ```json
    {
      "disease": "rust",
      "confidence": 98.2,
      "symptoms": "Yellow spots",
      "treatment": "Copper fungicide",
      "location": { "type": "Point", "coordinates": [36.82, -1.29] },
      "county": "Nyeri",
      "severity": "High"
    }
    ```

### 2\. Get Nearby Reports

Performs a geospatial search for outbreaks within a specific radius.

  * **Endpoint:** `GET /reports/nearby`
  * **Query Params:**
      * `lng`: Longitude (float)
      * `lat`: Latitude (float)
      * `radius`: Distance in km (default: 20)

### 3\. Filter by County

Retrieves all reports within a specific Kenyan county.

  * **Endpoint:** `GET /reports/county/{name}`
  * **Example:** `/reports/county/Nyeri`

-----

## AI Prediction

Reverse proxies the request to the local TensorFlow service.

### 1\. Predict Disease

  * **Endpoint:** `POST /ai/predict`
  * **Content-Type:** `multipart/form-data`
  * **Body:** `file` (Image of coffee leaf)
  * **Returns:** Predicted disease class and confidence score.

-----

## User Profile

Endpoints for managing user metadata. Requires JWT.

### 1\. Get Profile

  * **Endpoint:** `GET /user/profile`

### 2\. Update Profile

  * **Endpoint:** `PUT /user/profile`
  * **Payload:** (All fields optional)
    ```json
    {
      "name": "Salim Mwarika",
      "county": "Nyeri",
      "location": [36.82, -1.29]
    }
    ```

-----

## Data Structures

### GeoJSON Point

We strictly follow the GeoJSON standard for all location fields.

| Field | Type | Description |
| :--- | :--- | :--- |
| `type` | String | Must be `"Point"` |
| `coordinates` | Array | `[longitude, latitude]` |

### Disease Types

The AI model identifies the following classes:

  * `rust`
  * `cercospora`
  * `phoma`
  * `miner`
  * `healthy`

-----

## Environment Configuration

The backend requires a `.env` file with the following keys:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=xxxxx
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days

# AI service URL 
AI_SERVICE_URL=http://localhost:8000
```