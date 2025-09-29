# Khel-Dristi API Documentation

## Base URL
```
Production: https://api.kheldristi.com
Development: http://localhost:3001
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register New Athlete
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 22,
  "gender": "male",
  "sport": "Track & Field",
  "state": "Maharashtra",
  "district": "Mumbai",
  "phoneNumber": "+91-9876543210"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "sport": "Track & Field",
    "state": "Maharashtra",
    "district": "Mumbai"
  }
}
```

#### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Assessment Endpoints

#### Submit Assessment
```http
POST /api/assessment/submit
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `video`: Video file (MP4, MOV, AVI, WebM)
- `athleteId`: Athlete ID
- `testType`: One of "vertical-jump", "squat", "sprint", "push-up"
- `aiAnalysis`: JSON string with AI analysis data
- `kineticBlueprint`: JSON string with kinetic blueprint
- `performanceMetrics`: JSON string with performance metrics

**AI Analysis Format:**
```json
{
  "posePoints": [...],
  "repCount": 10,
  "biomechanicalScore": 85.5,
  "cheatDetected": false,
  "confidenceScore": 0.92
}
```

**Response:**
```json
{
  "message": "Assessment submitted successfully",
  "assessmentId": "assess_123",
  "analysis": {
    "score": 85.5,
    "ranking": {
      "percentile": 85,
      "category": "Advanced"
    },
    "feedback": "Excellent jump performance!",
    "badges": ["Gold Performance", "Fair Play"]
  },
  "proofHash": "abc123def456..."
}
```

#### Get Assessment History
```http
GET /api/assessment/history/:athleteId
```

**Response:**
```json
{
  "assessments": [
    {
      "id": "assess_123",
      "testType": "vertical-jump",
      "timestamp": "2024-01-20T10:30:00Z",
      "score": 85.5,
      "ranking": {
        "percentile": 85,
        "category": "Advanced"
      },
      "verified": true
    }
  ]
}
```

#### Get Leaderboard
```http
GET /api/assessment/leaderboard/:testType?state=Maharashtra&district=Mumbai
```

**Response:**
```json
{
  "testType": "vertical-jump",
  "leaderboard": [
    {
      "rank": 1,
      "athleteId": "athlete_456",
      "score": 95.2,
      "timestamp": "2024-01-20T10:30:00Z",
      "proofHash": "hash123..."
    }
  ],
  "totalParticipants": 1250
}
```

### Athlete Endpoints

#### Get Athlete Profile
```http
GET /api/athlete/profile/:athleteId
```

#### Update Athlete Profile
```http
PUT /api/athlete/profile/:athleteId
```

#### Get Athlete Statistics
```http
GET /api/athlete/stats/:athleteId
```

### Dashboard Endpoints (SAI Officials)

#### Get Dashboard Overview
```http
GET /api/dashboard/overview
```

#### Get Regional Statistics
```http
GET /api/dashboard/regional-stats?state=Maharashtra
```

#### Get Analytics
```http
GET /api/dashboard/analytics
```

#### Verify Assessment
```http
POST /api/dashboard/verify-assessment
```

**Request Body:**
```json
{
  "assessmentId": "assess_123",
  "officialId": "official_456",
  "decision": "approved",
  "notes": "Performance verified and approved"
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- Rate limit: 100 requests per 15 minutes per IP
- File upload limit: 100MB per request
- Concurrent connections: 1000 per server

## Data Integrity

All assessments include a proof-of-performance hash for verification:

```json
{
  "proofChain": {
    "hash": "sha256_hash_here",
    "previousHash": "previous_assessment_hash",
    "integrity": true
  }
}
```