# TapTask API Documentation

Complete REST API reference for TapTask backend.

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.example.com/api
```

## Authentication

All requests (except `/auth/login` and `/auth/register`) require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Token Format
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoiYWRtaW5AaG9zcGl0YWwubG9jYWwiLCJyb2xlIjoiYWRtaW4ifQ.xyz
```

## Response Format

All responses are JSON:

```json
{
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}
```

Error responses:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Authentication Endpoints

### POST /auth/login

Authenticate user with email and password.

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.local",
    "password": "admin123"
  }'
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@hospital.local",
    "name": "System Administrator",
    "role": "admin",
    "departmentId": null
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

### POST /auth/register

Create a new user account.

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@hospital.local",
    "name": "New User",
    "password": "secure-password",
    "role": "employee"
  }'
```

**Response (201 Created):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newuser@hospital.local",
    "name": "New User",
    "role": "employee"
  }
}
```

### GET /auth/me

Get current authenticated user.

**Request:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@hospital.local",
    "name": "System Administrator",
    "role": "admin",
    "isActive": true
  }
}
```

## Bins Endpoints

### GET /bins

List all bins with optional filtering.

**Query Parameters:**
- `departmentId` (string, optional) - Filter by department
- `search` (string, optional) - Search by bin code or item name

**Request:**
```bash
curl -X GET "http://localhost:3000/api/bins?departmentId=550e8400&search=ICU" \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "bins": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "KBN-ICU-0042",
      "itemName": "Saline Solution 0.9%",
      "currentQuantity": 5,
      "parLevel": 10,
      "department": "Intensive Care Unit"
    }
  ]
}
```

### GET /bins/:binCode

Get detailed information about a specific bin by code.

**Request:**
```bash
curl -X GET http://localhost:3000/api/bins/KBN-ICU-0042 \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "bin": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "code": "KBN-ICU-0042",
    "itemName": "Saline Solution 0.9%",
    "itemNumber": "INV-001",
    "gtin": "00051301422951",
    "unitOfMeasure": "Box",
    "parLevel": 10,
    "currentQuantity": 5,
    "binSize": 50,
    "departmentName": "Intensive Care Unit",
    "departmentCode": "ICU",
    "shelfLocation": "Shelf A1",
    "warehouseLocation": "Warehouse Section 1"
  },
  "recentHistory": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "requestType": "refill",
      "status": "completed",
      "requestedAt": "2024-01-01T10:00:00Z",
      "employeeId": "550e8400-e29b-41d4-a716-446655440000"
    }
  ]
}
```

## Requests Endpoints

### POST /requests

Create a new refill request.

**Request:**
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "binId": "550e8400-e29b-41d4-a716-446655440000",
    "requestType": "refill",
    "quantityRequested": 10,
    "notes": "Urgent - running low",
    "photoUrl": "https://example.com/photo.jpg"
  }'
```

**Request Types:**
- `refill` - Full refill needed
- `partial_refill` - Partial refill sufficient
- `damaged` - Bin is damaged

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "message": "Request submitted successfully"
}
```

### GET /requests

List refill requests with optional filtering.

**Query Parameters:**
- `status` (string, optional) - `pending|assigned|in_progress|completed|unable_to_fill`
- `departmentId` (string, optional)
- `technicianId` (string, optional)
- `limit` (number, optional, default: 50)
- `offset` (number, optional, default: 0)

**Request:**
```bash
curl -X GET "http://localhost:3000/api/requests?status=pending&departmentId=550e8400&limit=20" \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "requests": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "binCode": "KBN-ICU-0042",
      "itemName": "Saline Solution 0.9%",
      "requestType": "refill",
      "status": "pending",
      "quantityRequested": 10,
      "quantityFilled": null,
      "employeeName": "Jane Employee",
      "technicianName": null,
      "departmentName": "Intensive Care Unit",
      "priority": "normal",
      "requestedAt": "2024-01-01T10:00:00Z",
      "completedAt": null,
      "notes": "Urgent - running low"
    }
  ],
  "total": 15
}
```

### PATCH /requests/:requestId

Update request status (technician workflow).

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/requests/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "quantityFilled": 10
  }'
```

**Status Transitions:**
```
pending → assigned (technician accepts)
  ↓
in_progress (technician starts filling)
  ↓
completed (technician completes)
  
unable_to_fill (if unable to complete)
```

**Response (200 OK):**
```json
{
  "message": "Request updated successfully"
}
```

## Dashboard Endpoints

### GET /dashboard/kpis

Get supervisor KPIs and performance metrics.

**Requires Role:** `supervisor`, `admin`

**Request:**
```bash
curl -X GET http://localhost:3000/api/dashboard/kpis \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "openRequests": 15,
  "completedToday": 42,
  "avgResponseTime": 12,
  "overdueRequests": 2,
  "requestsByDepartment": [
    {
      "name": "Intensive Care Unit",
      "count": 8
    },
    {
      "name": "Emergency Room",
      "count": 7
    }
  ],
  "mostRequestedItems": [
    {
      "name": "Saline Solution 0.9%",
      "count": 12
    },
    {
      "name": "Sterile Gauze Pads",
      "count": 9
    }
  ]
}
```

### GET /dashboard/technician-stats

Get technician performance statistics.

**Requires Role:** `supervisor`, `admin`

**Request:**
```bash
curl -X GET http://localhost:3000/api/dashboard/technician-stats \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "stats": [
    {
      "name": "John Technician",
      "completed_count": 45,
      "avg_response_minutes": 8
    },
    {
      "name": "Mary Tech",
      "completed_count": 38,
      "avg_response_minutes": 11
    }
  ]
}
```

### GET /dashboard/inventory-health

Get inventory stock level status.

**Requires Role:** `supervisor`, `admin`

**Request:**
```bash
curl -X GET http://localhost:3000/api/dashboard/inventory-health \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "critical": {
    "count": 3,
    "items": [
      {
        "bin_code": "KBN-ICU-0042",
        "name": "Saline Solution 0.9%",
        "current_quantity": 1,
        "par_level": 10
      }
    ]
  },
  "low": {
    "count": 12,
    "items": [...]
  },
  "stockedOut": {
    "count": 2,
    "items": [...]
  }
}
```

## User Management Endpoints

### GET /users

List all users (admin only).

**Query Parameters:**
- `departmentId` (string, optional)
- `role` (string, optional) - `employee|technician|supervisor|admin`
- `search` (string, optional)

**Requires Role:** `admin`

**Request:**
```bash
curl -X GET "http://localhost:3000/api/users?role=technician" \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "tech@hospital.local",
      "name": "John Technician",
      "role": "technician",
      "departmentId": "550e8400-e29b-41d4-a716-446655440000",
      "isActive": true,
      "lastLogin": "2024-01-01T14:30:00Z"
    }
  ]
}
```

### POST /users

Create new user (admin only).

**Requires Role:** `admin`

**Request:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newtech@hospital.local",
    "name": "New Technician",
    "password": "secure-password",
    "role": "technician",
    "departmentId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Response (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "newtech@hospital.local",
  "name": "New Technician",
  "role": "technician"
}
```

### PATCH /users/:userId

Update user (admin only).

**Requires Role:** `admin`

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "role": "supervisor",
    "isActive": true
  }'
```

**Response (200 OK):**
```json
{
  "message": "User updated successfully"
}
```

### DELETE /users/:userId

Deactivate user (soft delete).

**Requires Role:** `admin`

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "message": "User deactivated successfully"
}
```

## Admin Endpoints

### GET /admin/departments

List all departments.

**Request:**
```bash
curl -X GET http://localhost:3000/api/admin/departments \
  -H "Authorization: Bearer <token>"
```

### POST /admin/departments

Create department.

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin/departments \
  -H "Authorization: Bearer <token>" \
  -d '{
    "code": "PEDI",
    "name": "Pediatrics",
    "location": "Building B, Floor 3"
  }'
```

### GET /admin/items

List all items.

**Query Parameters:**
- `search` (string, optional)

**Request:**
```bash
curl -X GET "http://localhost:3000/api/admin/items?search=saline" \
  -H "Authorization: Bearer <token>"
```

### POST /admin/items

Create item.

**Request:**
```bash
curl -X POST http://localhost:3000/api/admin/items \
  -H "Authorization: Bearer <token>" \
  -d '{
    "itemNumber": "INV-004",
    "name": "Glucose Strips",
    "gtin": "12345678901234",
    "unitOfMeasure": "Box",
    "parLevel": 20,
    "binSize": 100
  }'
```

### GET /admin/audit-log

Get audit trail (admin only).

**Query Parameters:**
- `userId` (string, optional)
- `limit` (number, optional, default: 100)
- `offset` (number, optional, default: 0)

**Request:**
```bash
curl -X GET "http://localhost:3000/api/admin/audit-log?limit=50" \
  -H "Authorization: Bearer <token>"
```

### GET /admin/analytics

Get system analytics.

**Query Parameters:**
- `period` (string, optional) - `today|week|month` (default: `today`)

**Request:**
```bash
curl -X GET "http://localhost:3000/api/admin/analytics?period=month" \
  -H "Authorization: Bearer <token>"
```

**Response (200 OK):**
```json
{
  "period": "month",
  "totalRequests": 523,
  "avgRefillTime": 14,
  "requestsByStatus": [
    {
      "status": "completed",
      "count": 520
    },
    {
      "status": "pending",
      "count": 3
    }
  ],
  "mostStockedOut": [...]
}
```

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_CREDENTIALS` | 401 | Email or password incorrect |
| `UNAUTHORIZED` | 401 | Token missing or invalid |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `INTERNAL_ERROR` | 500 | Server error |

## Rate Limiting

Rate limits are applied per user/IP:

- Authentication endpoints: 5 requests/minute
- API endpoints: 100 requests/minute
- Admin endpoints: 50 requests/minute

## Pagination

List endpoints support offset-based pagination:

```
?limit=20&offset=0  // First page
?limit=20&offset=20 // Second page
```

Response includes total count:
```json
{
  "items": [...],
  "total": 150
}
```

---

For more details, see [README.md](./README.md) or contact support@example.com
