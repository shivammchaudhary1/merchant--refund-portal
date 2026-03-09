# Merchant Refund Portal

A full-stack application for merchants to authenticate, view transaction history with filtering, and manage refund requests.

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

| Email                 | Password           |
| --------------------- | ------------------ |
| merchant1@example.com | SecurePassword123! |
| merchant2@example.com | SecurePassword123! |
| merchant3@example.com | SecurePassword123! |

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
