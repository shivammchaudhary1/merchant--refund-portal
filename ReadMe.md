# Merchant Refund Portal

A full-stack web application that allows merchants to authenticate, view their transaction history with filtering and pagination, and submit and track refund requests.

---

## Live Application

| Service     | URL                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------- |
| Frontend    | [https://merchant-refund-portal.vercel.app](https://merchant-refund-portal.vercel.app)               |
| Backend API | [https://merchant-refund-portal-9q1b.onrender.com](https://merchant-refund-portal-9q1b.onrender.com) |

---

## Purpose

The Merchant Refund Portal gives merchants a centralised dashboard to:

- Securely log in with email and password
- Browse paginated transaction records with status and date filters
- View detailed information about any individual transaction, including its status timeline
- Initiate a refund on eligible (Successful) transactions
- Track the refund status tied to a transaction

---

## Tech Stack

### Backend

| Layer            | Technology                                       |
| ---------------- | ------------------------------------------------ |
| Runtime          | Node.js                                          |
| Framework        | Express.js v5                                    |
| Language         | TypeScript (strict)                              |
| Database         | MongoDB + Mongoose v9                            |
| Authentication   | JSON Web Token (jsonwebtoken)                    |
| Password hashing | bcrypt                                           |
| Other            | CORS, compression, dotenv, uuid, @faker-js/faker |

### Frontend

| Layer            | Technology                     |
| ---------------- | ------------------------------ |
| Library          | React 19                       |
| Language         | TypeScript                     |
| Build tool       | Vite                           |
| State management | Redux Toolkit + react-redux    |
| UI framework     | Material UI (MUI v7) + MUI Lab |
| Routing          | React Router DOM v7            |
| Notifications    | React Hot Toast                |
| Date handling    | Day.js                         |

---

## Project Structure

```
mrp/
├── client/                        # React + Vite frontend
│   └── src/
│       ├── app/                   # Redux store + slices (auth, alert, transaction)
│       ├── components/common/     # Header, Footer, Loader, ExampleNotifications
│       ├── config/                # API base URL config
│       ├── pages/                 # Home, Login, Register, Dashboard, Transactions, TransactionDetail
│       ├── routes/                # AppRoutes, ProtectedRoute, PublicRoute
│       ├── styles/                # MUI theme and color tokens
│       ├── types/                 # TypeScript interfaces (auth, transaction, alert, route)
│       └── utils/                 # Notification hook utility
│
└── server/                        # Express + TypeScript backend
    └── src/
        ├── config/                # Database connection, JWT helpers, bcrypt helpers, env vars
        ├── controller/            # Auth controller, Transaction controller
        ├── interfaces/            # TypeScript interfaces (environment, jwt, merchant, refund, transaction)
        ├── middleware/            # Auth middleware, role middleware
        ├── models/                # Merchant, Transaction, Refund Mongoose models
        ├── routes/                # App routes, Auth routes, Transaction routes
        └── utils/                 # Seed script (seedTransactions.js)
```

---

## Features

### Authentication

- Merchant registration (business name, email, password)
- JWT-based login with token stored in `localStorage`
- Password hashed with bcrypt before storage
- Protected routes — unauthenticated users are redirected to `/login`
- Public routes — authenticated users are redirected away from `/login` and `/register`

### Transaction List

- Paginated table (default 10 per page, max 50)
- Server-side filtering by status and date range
- URL-synced filters — shareable and browser-back compatible
- Summary cards showing Successful / Failed / Pending counts
- Loading and empty state handling

### Transaction Detail

- Full transaction info with amount, status, merchant, and dates
- Status timeline showing every state change with timestamps
- Refund details displayed if the transaction has been refunded

### Refund

- Initiate a refund on any `Successful` transaction
- Backend validates refund eligibility and prevents duplicate refunds
- Refund amount and reason required

---

## API Endpoints

### Auth — `/api/auth`

| Method | Path        | Description              |
| ------ | ----------- | ------------------------ |
| POST   | `/register` | Register a new merchant  |
| POST   | `/login`    | Log in and receive a JWT |

### Transactions — `/api/transactions` _(requires Bearer token)_

| Method | Path              | Description                               |
| ------ | ----------------- | ----------------------------------------- |
| GET    | `/`               | List transactions (paginated + filtered)  |
| GET    | `/:id`            | Get a single transaction with refund info |
| POST   | `/:transactionId` | Initiate a refund on a transaction        |

**Query parameters for `GET /`:**

- `page` — page number (default `1`)
- `limit` — records per page (default `10`, max `50`)
- `status` — one of `Successful`, `Failed`, `Pending`, `Refunded`, `Initiated`, `Processing`
- `startDate` — ISO date string (inclusive)
- `endDate` — ISO date string (inclusive)

---

## Test Credentials

These accounts are seeded in the database with pre-existing transactions:

| Email               | Password            |
| ------------------- | ------------------- |
| merchant1@gmail.com | merchant1@gmail.com |
| merchant2@gmail.com | merchant2@gmail.com |
| merchant3@gmail.com | merchant3@gmail.com |

> You can also register a new account via `/register`. New accounts will have no transactions unless seeded manually.

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB (local instance or MongoDB Atlas connection string)

### 1. Clone the repository

```bash
git clone <repo-url>
cd mrp
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
NODE_ENV=development
PORT=8080
MONGO_URI=mongodb://localhost:27017/merchant-refund-portal
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
SALT_ROUNDS=10
```

Seed the database with test merchants and transactions:

```bash
node src/utils/seedTransactions.js
```

Start the dev server:

```bash
npm run dev
```

Backend runs on: `http://localhost:8080`

---

### 3. Setup the Frontend

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_BACKEND_API=http://localhost:8080
VITE_FRONTEND_URL=http://localhost:5173
```

Start the dev server:

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Development Commands

### Backend (`/server`)

| Command            | Description                                 |
| ------------------ | ------------------------------------------- |
| `npm run dev`      | Start with nodemon (auto-restart on change) |
| `npm run build`    | Compile TypeScript to `dist/`               |
| `npm start`        | Run compiled production build               |
| `npm run lint`     | Run ESLint                                  |
| `npm run lint:fix` | Auto-fix ESLint issues                      |

### Frontend (`/client`)

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start Vite dev server                |
| `npm run build`   | Type-check and build for production  |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

---

## How to Test

### Using the Live App

1. Go to [https://merchant-refund-portal.vercel.app](https://merchant-refund-portal.vercel.app)
2. Log in with any test credential from the table above
3. You will be taken to the Transactions page, which shows paginated transaction records
4. Use the **Status** dropdown and **Date Range** pickers to filter results
5. Click any transaction row to open the Transaction Detail page
6. If the transaction status is `Successful`, a **Refund** button will be available
7. Submit a refund with an amount and reason to initiate it

### Using the API Directly (e.g. Postman / curl)

**Login:**

```bash
curl -X POST https://merchant-refund-portal-9q1b.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "merchant1@example.com", "password": "SecurePassword123!"}'
```

Copy the `token` from the response.

**Get transactions:**

```bash
curl https://merchant-refund-portal-9q1b.onrender.com/api/transactions \
  -H "Authorization: Bearer <your-token>"
```

**Filter by status and date:**

```bash
curl "https://merchant-refund-portal-9q1b.onrender.com/api/transactions?status=Successful&startDate=2024-01-01&endDate=2024-12-31" \
  -H "Authorization: Bearer <your-token>"
```

**Get transaction detail:**

```bash
curl https://merchant-refund-portal-9q1b.onrender.com/api/transactions/<transaction-_id> \
  -H "Authorization: Bearer <your-token>"
```

**Initiate a refund:**

```bash
curl -X POST https://merchant-refund-portal-9q1b.onrender.com/api/transactions/<transactionId> \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 500, "reason": "Customer request"}'
```

---

## Database Schema

### Merchant

```
_id           ObjectId
businessName  String (unique)
email         String (unique)
password      String (hashed)
role          String — "admin" | "user"
isVerified    Boolean
createdAt     Date
updatedAt     Date
```

### Transaction

```
_id              ObjectId
merchantId       ObjectId → Merchant
transactionId    String (UUID)
amount           Number
status           String — Initiated | Processing | Successful | Failed | Pending | Refunded
transactionDate  Date
statusTimeline   Array<{ status, updatedAt, refundedAmount?, note? }>
createdAt        Date
updatedAt        Date
```

### Refund

```
_id             ObjectId
transactionId   ObjectId → Transaction
merchantId      ObjectId → Merchant
originalAmount  Number
amount          Number
reason          String
createdAt       Date
updatedAt       Date
```

---

## Deployment

| Layer    | Platform                     | Trigger                     |
| -------- | ---------------------------- | --------------------------- |
| Frontend | Vercel                       | Auto-deploy on push to main |
| Backend  | Render                       | Auto-deploy on push to main |
| Database | MongoDB Atlas (M0 free tier) | —                           |

---

## Author

**Shivam Chaudhary**

## Live Application

- **Frontend**: [https://merchant-refund-portal.vercel.app](https://merchant-refund-portal.vercel.app)
- **Backend API**: [https://merchant-refund-portal-9q1b.onrender.com](https://merchant-refund-portal-9q1b.onrender.com)

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcrypt
- **Additional**: CORS, compression, dotenv, uuid, faker

### Frontend

- **Library**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit + redux-persist
- **UI Framework**: Material-UI (MUI v7)
- **Router**: React Router DOM v7
- **Notifications**: React Hot Toast
- **Date Handling**: Day.js
- **Utilities**: query-string

## Test Credentials

| Email               | Password            |
| ------------------- | ------------------- |
| merchant1@gmail.com | merchant1@gmail.com |
| merchant2@gmail.com | merchant2@gmail.com |
| merchant3@gmail.com | merchant3@gmail.com |

## Project Structure

```
merchant--refund-portal/
├── client/                    # React + Vite Frontend
│   ├── src/
│   │   ├── pages/            # Dashboard, Home, Login, Register, Transactions, TransactionDetail
│   │   ├── components/       # Header, Footer, Loader, ExampleNotifications
│   │   ├── app/              # Redux store and slices (auth, alert, transaction)
│   │   ├── config/           # API configuration
│   │   ├── routes/           # Route protection and routing
│   │   ├── styles/           # Theme and colors
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # Notification utilities
│   └── vite.config.ts
│
├── server/                    # Express + TypeScript Backend
│   ├── src/
│   │   ├── controller/       # Auth, Transaction controllers
│   │   ├── models/           # Merchant, Transaction, Refund schemas
│   │   ├── interfaces/       # TypeScript definitions
│   │   ├── routes/           # Auth and Transaction routes
│   │   ├── middleware/       # Auth middleware
│   │   ├── config/           # Database and JWT config
│   │   └── utils/            # Seeding utilities
│   └── tsconfig.json
│
└── ReadMe.md
```

## Implemented Features

### ✅ Authentication

- Merchant registration with email and password
- JWT-based login authentication
- Password hashing with bcrypt
- Protected routes - unauthenticated users redirected to login
- Redux-based auth state management with localStorage persistence

### ✅ Transaction List

- Paginated transaction table (10 per page)
- Server-side filtering by:
  - Transaction status (All, Successful, Failed, Pending, Refunded)
  - Date range (from/to)
- Responsive Material-UI table design
- Loading states and empty state handling
- 500+ seeded transactions across merchant accounts

### ✅ Transaction Detail

- Dedicated transaction detail page
- View all transaction information
- Material-UI driven responsive layout

### ✅ Code Quality

- TypeScript throughout (strict mode)
- No implicit any types
- Environment variables for all secrets (.env.example provided)
- RESTful API design with consistent response structure
- Proper HTTP status codes
- Input validation on backend endpoints

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new merchant
- `POST /api/auth/login` - Login merchant

### Transactions

- `GET /api/transactions` - Get transactions with pagination & filters
  - Query params: `page`, `limit`, `status`, `startDate`, `endDate`
- `GET /api/transactions/:id` - Get single transaction detail

## Setup Instructions

### Backend

```bash
cd server
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
EOF

# Seed database
npm run seed

# Start dev server
npm run dev
```

### Frontend

```bash
cd client
npm install

# Create .env.local file
cat > .env.local << EOF
VITE_API_URL=http://localhost:5000
EOF

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5000`

## Development Commands

**Backend**:

- `npm run dev` - Start with nodemon
- `npm run build` - Compile TypeScript
- `npm start` - Run production build
- `npm run lint` - ESLint check
- `npm run lint:fix` - Auto-fix linting issues

**Frontend**:

- `npm run dev` - Start Vite dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - ESLint check

## Database Schema

### Merchants

```
_id: ObjectId
businessName: String
email: String (unique)
password: String (hashed)
role: String enum
isVerified: Boolean
createdAt: Date
updatedAt: Date
```

### Transactions

```
_id: ObjectId
merchantId: ObjectId (ref: Merchant)
transactionId: String (unique)
amount: Number
currency: String
status: String enum (Successful, Failed, Pending, Refunded)
transactionDate: Date
description: String
createdAt: Date
updatedAt: Date
```

### Refunds

```
_id: ObjectId
transactionId: ObjectId (ref: Transaction)
merchantId: ObjectId (ref: Merchant)
amount: Number
reason: String
createdAt: Date
updatedAt: Date
```

## Features In Development

- Refund request form and eligibility rules
- Refund API endpoints with validation
- Transaction status timeline
- Search by Transaction ID
- Refund status tracking and updates

## Deployment

- **Frontend**: Vercel (auto-deploy from GitHub)
- **Backend**: Render (auto-deploy from GitHub)
- **Database**: MongoDB Atlas (free M0 tier)

## Error Handling

- Specific error messages for validation failures
- Proper HTTP status codes (400, 401, 404, 500)
- User-friendly toast notifications for feedback
- Loading states during async operations

## Notes

- Monorepo structure with unified version control
- TypeScript strict mode enforced
- Responsive design with Material-UI
- Redux for predictable state management
- All secrets managed via environment variables
