# User API Reference — Seafarer Endpoints

This document details all API endpoints accessible to the standard `USER` role (the shipboard Seafarer). All requests should target the resolved base URL configured in your environment.

---

## 1. Authentication & Profile Module

### Signup Seafarer
- **Endpoint**: `/auth/signup`
- **HTTP Method**: `POST`
- **Purpose**: Creates a new seafarer account. Sets the default role to `USER` and triggers an email confirmation OTP.
- **Authentication Required**: No
- **Request Body (JSON)**:
  ```json
  {
    "email": "officer@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "fullName": "John Doe",
    "rank": "Second Officer",
    "signOnDate": "2026-07-15T00:00:00.000Z"
  }
  ```
- **Query Parameters**: None
- **Path Parameters**: None
- **Success Response (201 Created)**:
  ```json
  {
    "statusCode": 201,
    "message": "User registered successfully. Please verify your email.",
    "result": {
      "id": "60a12345bc67890def123456",
      "email": "officer@example.com",
      "fullName": "John Doe",
      "isVerified": false
    }
  }
  ```
- **Failure Responses**:
  - `400 Bad Request`: Validation failure (e.g. invalid email format, passwords do not match, weak password).
  - `409 Conflict`: Account with this email already exists.
- **Frontend Notes**: Always check the `isVerified` flag. If false, redirect the user to the OTP verification screen.

---

### Confirm Email (OTP)
- **Endpoint**: `/auth/confirm-email`
- **HTTP Method**: `POST`
- **Purpose**: Verifies the account using the OTP code sent via email.
- **Authentication Required**: No
- **Request Body (JSON)**:
  ```json
  {
    "email": "officer@example.com",
    "otp": "123456"
  }
  ```
- **Query / Path Parameters**: None
- **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Email verified successfully.",
    "result": {
      "isVerified": true
    }
  }
  ```
- **Failure Responses**:
  - `400 Bad Request`: Invalid or expired OTP.
  - `404 Not Found`: User not found.

---

### Resend OTP Verification
- **Endpoint**: `/auth/resend-confirmation-otp`
- **HTTP Method**: `POST`
- **Purpose**: Resends a new email verification code.
- **Authentication Required**: No
- **Request Body (JSON)**:
  ```json
  {
    "email": "officer@example.com"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "OTP resent successfully."
  }
  ```

---

### Login Seafarer
- **Endpoint**: `/auth/login`
- **HTTP Method**: `POST`
- **Purpose**: Authenticates credentials and returns access and refresh tokens.
- **Authentication Required**: No
- **Request Body (JSON)**:
  ```json
  {
    "email": "officer@example.com",
    "password": "Password123!"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Login successful.",
    "result": {
      "access_Token": "eyJhbGciOi...",
      "refresh_Token": "eyJhbGciOi...",
      "user": {
        "id": "60a12345bc67890def123456",
        "email": "officer@example.com",
        "fullName": "John Doe",
        "role": "USER",
        "isActive": true
      }
    }
  }
  ```
- **Failure Responses**:
  - `400 Bad Request`: Incorrect fields.
  - `404 Not Found`: Incorrect email or password.
  - `403 Forbidden`: Account is suspended.
- **Frontend Notes**: Store the `access_Token` securely in memory or short-lived state, and `refresh_Token` in secure persistent storage.

---

### Token Refresh Rotation
- **Endpoint**: `/auth/refresh`
- **HTTP Method**: `POST`
- **Purpose**: Rotates access token using a valid refresh token.
- **Authentication Required**: No
- **Request Body (JSON)**:
  ```json
  {
    "refreshToken": "eyJhbGciOi..."
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Token refreshed successfully.",
    "result": {
      "access_Token": "eyJhbGciOi..."
    }
  }
  ```
- **Failure Responses**:
  - `401 Unauthorized`: Refresh token expired or blacklisted.

---

### Google OAuth Login
- **Endpoint**: `/auth/google-login`
- **HTTP Method**: `POST`
- **Purpose**: Logs in or registers a user via a Google OAuth ID credential token.
- **Authentication Required**: No
- **Request Body (JSON)**:
  ```json
  {
    "credential": "google-id-token-string"
  }
  ```
- **Success Response (200 OK)**: Returns standard login access and refresh token payload.

---

### Get My Profile
- **Endpoint**: `/auth/me`
- **HTTP Method**: `GET`
- **Purpose**: Fetches profile data of the currently logged-in user.
- **Authentication Required**: Yes (Bearer Token)
- **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "result": {
      "id": "60a12345bc67890def123456",
      "email": "officer@example.com",
      "fullName": "John Doe",
      "role": "USER",
      "rank": "Second Officer",
      "isActive": true
    }
  }
  ```

---

## 2. Vessel Module

### Create Vessel
- **Endpoint**: `/vessel/create`
- **HTTP Method**: `POST`
- **Purpose**: Registers a new vessel under the user's profile.
- **Authentication Required**: Yes (Bearer Token)
- **Request Body (JSON)**:
  ```json
  {
    "name": "Pacific Voyager",
    "type": "LPG",
    "grt": 45000,
    "dwt": 75000
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "statusCode": 201,
    "message": "Vessel created successfully.",
    "result": {
      "_id": "60b98765bc43210fed123456",
      "name": "Pacific Voyager",
      "type": "LPG",
      "isActive": false
    }
  }
  ```

---

### List My Vessels
- **Endpoint**: `/vessel/list`
- **HTTP Method**: `GET`
- **Purpose**: Returns all vessels created by the user.
- **Authentication Required**: Yes (Bearer Token)
- **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "result": [
      {
        "_id": "60b98765bc43210fed123456",
        "name": "Pacific Voyager",
        "type": "LPG",
        "isActive": true
      }
    ]
  }
  ```

---

### Set Active Vessel
- **Endpoint**: `/vessel/:vesselId/activate`
- **HTTP Method**: `PATCH`
- **Purpose**: Selects a vessel to be the active context. Auto-bootstraps active template structures.
- **Authentication Required**: Yes (Bearer Token)
- **Path Parameters**:
  - `vesselId`: The ID of the vessel to activate.
- **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Vessel activated successfully."
  }
  ```

---

## 3. Tasks & Checklists Module

### Retrieve Checklist Items
- **Endpoint**: `/task/list`
- **HTTP Method**: `GET`
- **Purpose**: Fetches categories and task definitions currently structured for the active vessel.
- **Authentication Required**: Yes (Bearer Token)
- **Query Parameters**:
  - `vesselId` (Required): The active vessel ID.
  - `taskGroup` (Optional): Filter by `Daily`, `Weekly`, `Monthly`, or `SigningOn`.
- **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "result": [
      {
        "category": {
          "id": "60c12345bc",
          "name": "Bridge Controls",
          "displayOrder": 1
        },
        "tasks": [
          {
            "id": "60d54321bc",
            "title": "Gyro calibration",
            "description": "Inspect and match repeaters",
            "displayOrder": 1
          }
        ]
      }
    ]
  }
  ```

---

### Reorder Tasks Locally
- **Endpoint**: `/task/reorder`
- **HTTP Method**: `PATCH`
- **Purpose**: Customizes category/task ordering layout on the shipboard app.
- **Authentication Required**: Yes (Bearer Token)
- **Request Body (JSON)**:
  ```json
  [
    { "id": "60d54321bc", "displayOrder": 2 },
    { "id": "60d99999bc", "displayOrder": 1 }
  ]
  ```
- **Success Response (200 OK)**: Standard success message.

---

## 4. Task Records (Execution) Module

### Complete Task
- **Endpoint**: `/task-record/:recordId/complete`
- **HTTP Method**: `PATCH`
- **Purpose**: Logs a task execution with completed state, timestamp, measurements, and comments.
- **Authentication Required**: Yes (Bearer Token)
- **Path Parameters**:
  - `recordId`: ID of the checklist item record.
- **Request Body (JSON)**:
  ```json
  {
    "notes": "Calibration successful. Deviation 0.5 degrees.",
    "measurement": "0.5"
  }
  ```
- **Success Response (200 OK)**: Returns updated record document.

---

### Postpone Task
- **Endpoint**: `/task-record/:recordId/postpone`
- **HTTP Method**: `PATCH`
- **Purpose**: Logs a delay for a task, transitioning status to postponed.
- **Authentication Required**: Yes (Bearer Token)
- **Path Parameters**:
  - `recordId`: ID of the record.
- **Request Body (JSON)**:
  ```json
  {
    "reason": "Severe weather conditions prevent outdoor inspection."
  }
  ```
- **Success Response (200 OK)**: Returns updated record showing postponed state.

---

### List Daily Records
- **Endpoint**: `/task-record/list`
- **HTTP Method**: `GET`
- **Purpose**: Fetches logs and states for a specific date.
- **Authentication Required**: Yes (Bearer Token)
- **Query Parameters**:
  - `vesselId` (Required): Active vessel ID.
  - `date` (Required): Target calendar date (`YYYY-MM-DD`).
- **Success Response (200 OK)**: List of category and task records with completed/postponed/pending statuses.

---

## 5. Issues Module

### Log Task Issue
- **Endpoint**: `/issue/create`
- **HTTP Method**: `POST`
- **Purpose**: Reports an operational error or damaged item linked to a checklist task execution.
- **Authentication Required**: Yes (Bearer Token)
- **Request Body (JSON)**:
  ```json
  {
    "taskRecordId": "60b23456cd78901efg234567",
    "description": "Hydraulic oil leak on steering gear cylinder seals.",
    "note": "Reported to Chief Engineer. Gasket needs replacement.",
    "imageUrl": "https://res.cloudinary.com/.../leak.jpg",
    "issueDate": "2026-07-15T00:45:00.000Z"
  }
  ```
- **Success Response (201 Created)**: Returns created issue entry.

---

### List Vessel Issues
- **Endpoint**: `/issue/list`
- **HTTP Method**: `GET`
- **Purpose**: Returns active/resolved issues log for a vessel.
- **Authentication Required**: Yes (Bearer Token)
- **Query Parameters**:
  - `vesselId` (Required): Active vessel ID.
- **Success Response (200 OK)**: Array of issue structures.

---

## 6. Offline Queue Sync Module

### Bulk Push Synchronization
- **Endpoint**: `/sync`
- **HTTP Method**: `POST`
- **Purpose**: Processes a queue of offline-logged operations sequentially to synchronize Shipboard browser state with Shore servers.
- **Authentication Required**: Yes (Bearer Token)
- **Request Body (JSON)**:
  ```json
  {
    "vesselId": "60b98765bc43210fed123456",
    "operations": [
      {
        "idempotencyKey": "uuid-v4-string-1",
        "model": "taskRecord",
        "action": "update",
        "payload": {
          "taskRecordId": "60b23456cd78901efg234567",
          "status": 1,
          "completionDate": "2026-07-15T00:30:00.000Z",
          "notes": "Completed during offline navigation."
        }
      }
    ]
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "message": "Synchronization completed successfully.",
    "result": {
      "processed": 1,
      "failed": 0,
      "details": [
        { "idempotencyKey": "uuid-v4-string-1", "status": "success" }
      ]
    }
  }
  ```
- **Failure Responses**:
  - `400 Bad Request`: Missing params or malformed payloads.

---

## 7. Metrics & Dashboard Module

### Fetch Dashboard Aggregates
- **Endpoint**: `/dashboard`
- **HTTP Method**: `GET`
- **Purpose**: Gathers checklist progression rates, counts of pending items, and active issues list.
- **Authentication Required**: Yes (Bearer Token)
- **Query Parameters**:
  - `vesselId` (Required): Active vessel ID.
- **Success Response (200 OK)**:
  ```json
  {
    "statusCode": 200,
    "result": {
      "complianceRate": 94.5,
      "completedCount": 18,
      "pendingCount": 2,
      "postponedCount": 1,
      "activeIssues": 3
    }
  }
  ```

---

## 8. History & Exports Module

### Query Paginated Log History
- **Endpoint**: `/history`
- **HTTP Method**: `GET`
- **Purpose**: Searches and filters past task execution logs.
- **Authentication Required**: Yes (Bearer Token)
- **Query Parameters**:
  - `vesselId` (Required): Target vessel.
  - `page`: Page index (default: 1).
  - `limit`: Items per page (default: 20).
  - `startDate`: ISO filter start date.
  - `endDate`: ISO filter end date.
- **Success Response (200 OK)**: Standard paginated layout of logged task records.

---

### Export PDF Report
- **Endpoint**: `/export/pdf`
- **HTTP Method**: `GET`
- **Purpose**: Generates and downloads a print-ready PDF logbook file.
- **Authentication Required**: Yes (Bearer Token)
- **Query Parameters**:
  - `vesselId` (Required): Vessel context.
  - `startDate`: ISO filter start date.
  - `endDate`: ISO filter end date.
- **Success Response (200 OK)**: Binary stream of application/pdf file.

---

### Export Excel Sheet
- **Endpoint**: `/export/excel`
- **HTTP Method**: `GET`
- **Purpose**: Generates and downloads an Excel spreadsheet.
- **Authentication Required**: Yes (Bearer Token)
- **Query Parameters**: Same as PDF export.
- **Success Response (200 OK)**: Binary stream of spreadsheet file.
