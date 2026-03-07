# Multi-Tenant Clinic SaaS Backend

## Overview
A production-ready robust Node.js and Express backend built for a Multi-Tenant Clinic SaaS platform. It incorporates a strictly isolated tenant architecture (using MongoDB references), role-based JWT authentication, and high-performance data aggregation workflows.

---

## Tech Stack
- **Node.js** & **Express.js** (Server Framework)
- **MongoDB** & **Mongoose** (NoSQL Database & Object Modeling)
- **jsonwebtoken** & **bcryptjs** (Authentication & Cryptography)
- **express-validator** (Request Lifecycle Validation)
- **Morgan**, **Helmet**, **Cors**, **Dotenv** (Security & Config Utilities)

---

## Architecture Explanation
The application is structured using a clean MVC (Model-View-Controller) pattern with dedicated Service layers to isolate abstract business logic. 
* **Multi-Tenancy**: Every User and Patient inherently belongs to a specific `Clinic`. The JWT payload contains the user's `clinicId`, which the Auth Middleware strictly injects or filters against in the Data Access Layer to ensure no clinic can access another clinic's records.

### Folder Structure
```text
src/
  ├── config/        # Environment and DB config (db.js, index.js)
  ├── controllers/   # Request mapping and HTTP response handling
  ├── middleware/    # Global handlers (auth validator, error mapping)
  ├── models/        # Mongoose database schemas (Clinic, User, Patient)
  ├── routes/        # Express Routing index and definitions
  ├── services/      # Abstracted database interactions (Auth service)
  └── validators/    # express-validator strict definitions
```

---

## Getting Started

### Prerequisites
- Node.js installed locally
- MongoDB running locally or a MongoDB Atlas URI

### Setup Instructions
1. **Clone the repository**
   ```bash
   git clone https://github.com/heyysid18/clinic-saas-backend.git
   cd clinic-saas-backend
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Configure Environment Variables**
   Create a `.env` file in the root matching `.env.example`:
   ```env
   PORT=5001
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/clinic-saas
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   ```
4. **Run the Application**
   ```bash
   npm run dev
   ```
   *(Server should boot on `http://localhost:5001` or your configured PORT)*

### Docker Setup
If you prefer running everything in a containerized environment (Node + MongoDB):

1. **Build and spin up the containers automatically**
   ```bash
   docker-compose up -d --build
   ```
2. **Access the application locally**:
   The Docker composition explicitly exposes the backend on **Port 5000**: `http://localhost:5000`
3. **Persisted Data**:
   Database records are safely persisted via the attached `mongo-data` volume so you will not lose patients when tearing down containers (`docker-compose down`).

---

## API Endpoints

### Authentication `/api/v1/auth`

#### 👉 Register a new Clinic + Admin User
- **URL**: `POST /api/v1/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "clinicName": "City General",
    "clinicAddress": "123 Main St",
    "userName": "Admin Dave",
    "email": "dave@citygeneral.com",
    "password": "password123",
    "role": "admin"
  }
  ```
- **Success Response** (`201 Created`): Returns User, ClinicId, and generated `token`.

#### 👉 Login
- **URL**: `POST /api/v1/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "dave@citygeneral.com",
    "password": "password123"
  }
  ```
- **Success Response** (`200 OK`): Returns JSON including `token`.

---

### Patients `/api/v1/patients`
*⚠️ **Note**: Every endpoint below requires an `Authorization` header formatted as: `Bearer <token>`*

#### 👉 Add New Patient
- **URL**: `POST /api/v1/patients`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "age": 45,
    "gender": "male",
    "phone": "555-0199",
    "testType": "Blood Test"
  }
  ```
- **Success Response** (`201 Created`): The system injects the `clinicId` automatically based on the token.

#### 👉 Get All Patients (For Your Clinic)
- **URL**: `GET /api/v1/patients?page=1&limit=10&search=John`
- **Query Params (Optional)**: `page`, `limit`, `search` (searches Name or Phone)
- **Success Response** (`200 OK`): Returns paginated list of patients bound to logged-in user's Clinic.

#### 👉 Get / Delete Single Patient
- **URL**: `GET /api/v1/patients/:id`  |  `DELETE /api/v1/patients/:id`
- **Behavior**: Retrieves/deletes specific patient only if they belong to your tenant clinic.

---

### Dashboard `/api/v1/dashboard`
*⚠️ **Note**: Requires `Authorization: Bearer <token>`*

#### 👉 Get Clinic Analytics
- **URL**: `GET /api/v1/dashboard`
- **Description**: Uses a high-performance MongoDB `$facet` aggregation to perform multi-pipeline calculations in one round-trip.
- **Success Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "totalPatients": 142,
      "testsToday": 12,
      "pendingReports": 5
    }
  }
  ```

---

## Postman Testing Guide

1. Send a POST request to `/api/v1/auth/register` using dummy data.
2. In the response, copy the provided JWT `token`.
3. In Postman, switch your active Collection's **Authorization** tab to `Bearer Token`.
4. Paste the copied token.
5. You can now freely test creating Patients via `POST /api/v1/patients`, fetching them, or seeing immediate stats reflection in `GET /api/v1/dashboard`!
