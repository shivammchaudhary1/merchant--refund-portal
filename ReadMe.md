# Merchant Refund Portal

A production-level full-stack application for merchants to manage transaction history and initiate refund requests with enforced eligibility rules.

## Live Application

- **Frontend**: [https://merchant-refund-portal.vercel.app](https://merchant-refund-portal.vercel.app)
- **Backend API**: [https://merchant-refund-portal-9q1b.onrender.com](https://merchant-refund-portal-9q1b.onrender.com)

## Test Credentials

Use one of the following accounts to test the application:

| Email                 | Password           |
| --------------------- | ------------------ |
| merchant1@example.com | SecurePassword123! |
| merchant2@example.com | SecurePassword123! |
| merchant3@example.com | SecurePassword123! |

## Project Overview

This is a scoped, production-level product feature. The application allows merchants to:

- Securely authenticate with JWT-based authentication
- View their transaction history with advanced filtering and search
- Examine transaction details including status timelines
- Initiate and track refund requests on eligible transactions
- Experience real-time status updates and comprehensive error feedback

The system enforces strict refund eligibility rules at the backend level, ensuring data integrity and preventing invalid state transitions.

## Architecture

### Repository Structure

```
merchant--refund-portal/
├── client/                  # React TypeScript Frontend (Vite)
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable UI components
│   │   ├── app/            # Redux store and slices
│   │   ├── config/         # Configuration files
│   │   ├── routes/         # Route protection logic
│   │   ├── styles/         # Theme and color definitions
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   └── vite.config.ts      # Build configuration
│
├── server/                  # Node.js + NestJS Backend
│   ├── src/
│   │   ├── controller/     # API endpoints
│   │   ├── models/         # MongoDB schemas
│   │   ├── interfaces/     # TypeScript interfaces
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth and custom middleware
│   │   ├── config/         # Database and environment config
│   │   └── utils/          # Seeding and utilities
│   └── tsconfig.json       # TypeScript configuration
│
└── ReadMe.md               # This file
```

**Architecture Decision**: Monorepo structure with separate client and server folders. This allows:

- Unified version control and easier code review
- Shared TypeScript types between frontend and backend
- Simplified deployment and testing workflows

---

## Functional Requirements

### 1. Authentication

- **JWT-based authentication** with access and refresh tokens
- **Protected routes**: All routes except `/login` require authentication
- **Session persistence**: Token stored in localStorage; survives page refreshes
- **Logout functionality**: Clears session and redirects to login
- **Test accounts**: 3 pre-seeded merchant accounts in the database

**Implementation Notes**:

- JWT tokens are validated on every protected API request
- Frontend uses Redux for global auth state management
- ProtectedRoute component redirects unauthenticated users to login
- Token refresh logic handles expired access tokens gracefully

### 2. Transaction List

- **Paginated table**: 10 transactions per page
- **Search & Filters** (server-side):
  - Date range picker (from / to dates)
  - Status filter: All, Successful, Failed, Pending, Refunded
  - Search by Transaction ID
- **URL persistence**: Filters and page numbers persist in query strings for shareability
- **User feedback**: Loading states and empty states for better UX
- **Seed data**: 500+ transactions across merchant accounts with varied statuses and dates

**Implementation Notes**:

- Server-side filtering reduces data transfer
- Query parameters allow users to share filtered views
- Pagination handled by backend with offset-limit approach

### 3. Transaction Detail

- **Detail view**: Modal or dedicated page displaying full transaction information
- **Status Timeline**: Chronological display of transaction status changes (e.g., Initiated → Processing → Successful)
- **Refund eligibility check**: Shows "Raise Refund" button if eligible, otherwise displays reasons for ineligibility
- **Complete information**: All transaction fields visible with clear formatting

**Implementation Notes**:

- Status Timeline populated from `TransactionStatusEvents` collection
- Refund eligibility determined by backend validation before showing the button
- Transaction detail page is deeply linkable via route params

### 4. Refund Request Flow

#### Eligibility Rules (Enforced at Backend)

- ✓ Only **Successful** transactions can be refunded
- ✓ **No duplicate refunds**: A transaction can only be refunded once
- ✓ **30-day window**: Refund must be raised within 30 days of transaction date
- ✓ **Amount validation**: Refund amount cannot exceed original transaction amount
- ✓ **Partial refunds**: Are allowed

#### Flow Steps

1. User clicks "Raise Refund" on an eligible transaction
2. Refund form opens with fields for amount and reason
3. Backend validates refund eligibility and constraints
4. On success:
   - Transaction status updates to "Refunded"
   - Timeline records the new refund event
   - UI confirms the action with a success toast
5. On failure:
   - **Specific error messages** (not generic "Something went wrong")
   - Clear explanation of which rule was violated
   - User can retry or cancel

**Implementation Notes**:

- Backend re-validates eligibility before processing (no client-side trust)
- Refund records stored in `Refunds` collection
- Transaction status events trigger status history updates
- Detailed error messages help users understand why a refund failed

---

## Technical Stack

### Backend

- **Runtime**: Node.js
- **Framework**: NestJS (with TypeScript)
- **Language**: TypeScript (strict mode, no implicit any)
- **API Design**: RESTful with consistent response structure
- **HTTP Status Codes**: Proper status codes for success/error (not 200 for errors)
- **Input Validation**: Comprehensive validation on all endpoints

### Database

- **Primary**: MongoDB Atlas (free M0 tier)
- **Alternative**: PostgreSQL (also supported)

#### Schema & Collections

**Merchants**

```typescript
{
  _id: ObjectId,
  email: String (unique),
  passwordHash: String,
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Transactions**

```typescript
{
  _id: ObjectId,
  merchantId: ObjectId (ref: Merchants),
  transactionId: String (unique),
  amount: Number,
  currency: String,
  status: String (enum: Successful, Failed, Pending, Refunded),
  createdAt: Date,
  updatedAt: Date,
  description: String
}
```

**Refunds**

```typescript
{
  _id: ObjectId,
  transactionId: ObjectId (ref: Transactions),
  merchantId: ObjectId (ref: Merchants),
  refundAmount: Number,
  reason: String,
  status: String (enum: Pending, Approved, Rejected),
  createdAt: Date,
  approvedAt: Date
}
```

**TransactionStatusEvents**

```typescript
{
  _id: ObjectId,
  transactionId: ObjectId (ref: Transactions),
  status: String,
  timestamp: Date,
  eventDescription: String
}
```

#### Database Indexes

| Collection              | Fields                           | Index Name            | Reason                                         |
| ----------------------- | -------------------------------- | --------------------- | ---------------------------------------------- |
| Merchants               | email (1)                        | idx_merchant_email    | Fast login lookups by email                    |
| Transactions            | merchantId (1), createdAt (-1)   | idx_txn_merchant_date | Filter transactions by merchant and date range |
| Transactions            | transactionId (1)                | idx_txn_id            | Search by transaction ID                       |
| Transactions            | status (1)                       | idx_txn_status        | Filter by transaction status                   |
| Refunds                 | transactionId (1)                | idx_refund_txn        | Check for duplicate refunds                    |
| TransactionStatusEvents | transactionId (1), timestamp (1) | idx_sce_txn_time      | Retrieve status timeline                       |

**Rationale**: Indexes on frequently queried and filtered fields reduce query time from O(n) to O(log n), critical for the 500+ transaction dataset.

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (faster builds and HMR than Create React App)
- **State Management**: Redux Toolkit (auth, alerts, transactions)
- **UI Library**: Custom CSS with theme system (colors.ts, theme.ts)
- **TypeScript**: Strict mode, no implicit any
- **Language**: TypeScript throughout

**Framework Choice Rationale**:

- React + Vite chosen over Next.js because:
  - This is a client-side SPA with no SSR requirements
  - Merchant portal doesn't need SEO benefits
  - Vite provides faster development experience and smaller bundle
  - Easier to host on Vercel without server-side complexity

---

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup

```bash
cd server
npm install

# Create .env file
cat > .env << EOF
NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=30d
CORS_ORIGIN=http://localhost:3000
EOF

# Seed the database
npm run seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd client
npm install

# Create .env.local file
cat > .env.local << EOF
VITE_API_URL=http://localhost:5000
EOF

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## Development Workflow

### Backend Commands

```bash
# Development with auto-reload
npm run dev

# Production build
npm run build

# Run production server
npm run start

# Run tests (if implemented)
npm test
```

### Frontend Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

---

## Code Quality Standards

### ✓ Implemented

- **No implicit any**: TypeScript strict mode enforced
- **No dead code**: All code actively used, no abandoned blocks
- **No console.log statements**: Logging implemented via proper logging library
- **Environment variables**: All secrets and config in `.env` files
- **Folder structure**: Logical, scalable organization
- **.env.example**: Provided for easy onboarding

### ✓ Error Handling

- **Specific error messages**: Users understand what went wrong and why
- **No generic errors**: "Something went wrong" replaced with actionable messages
- **Proper HTTP status codes**: 401 for auth, 400 for validation, 409 for conflicts, etc.

---

## UI/UX Implementation

### Layout & Visual Hierarchy

- **Whitespace**: Deliberate use for visual clarity and focus
- **Typography**: Consistent scale with semantic HTML (h1, h2, p, small)
- **Color Palette**: Limited palette defined in `theme.ts` for intentional usage
- **Data Presentation**: Transaction table optimized for scanning with zebra striping

### Interaction Quality

- **Button States**: Hover and active states on all interactive elements
- **Form Fields**: Clear focus states, validation feedback, and error messages
- **Modals**: Dismissible with Escape key and close button
- **Refund Confirmation**: Destructive action requires explicit confirmation step

### Feedback & States

- **Action Feedback**: Every action receives visible response (success/error toast)
- **Loading States**: Skeleton loaders during data fetches
- **Error States**: Clear error messages, retry options
- **Empty States**: User-friendly empty state when no transactions match filters
- **Disabled States**: Visually distinct, not clickable

---

## Deployment

### Frontend (Vercel)

```bash
# Push to GitHub, Vercel auto-deploys
# No additional setup needed, connected via GitHub
```

### Backend (Render)

```bash
# Push to GitHub, Render auto-deploys
# Environment variables configured in Render dashboard
# Connected to GitHub repo for continuous deployment
```

### Database (MongoDB Atlas)

- Free M0 Cluster created
- Connection string configured in backend environment variables
- Auto backup enabled
- IP whitelist includes Render deployment IP

---

## Testing the Application

### Authentication Flow

1. Navigate to frontend URL
2. Log in with test credentials (see Test Credentials section)
3. Session persists across page refresh
4. Logout clears session and redirects to login

### Transaction Management

1. View transaction list with pagination
2. Apply filters: date range, status, transaction ID search
3. Share a filtered view URL (query params persist)
4. Click transaction to view details
5. Examine status timeline

### Refund Flow

1. On eligible transaction detail, click "Raise Refund"
2. Fill in refund amount (must be ≤ transaction amount)
3. Add refund reason
4. Confirm refund (confirmation dialog)
5. Verify status updates to "Refunded"
6. Check timeline for refund event

### Edge Cases to Test

- Try to refund a failed transaction (should fail with specific error)
- Try to refund the same transaction twice (should fail)
- Try to refund a transaction beyond 30 days (should fail)
- Try to refund more than transaction amount (should fail)
- Partial refund on large transaction (should succeed)

---

## Design Decisions & Tradeoffs

### 1. JWT-Based Authentication

**Why**: Industry standard, stateless, good for distributed systems
**Tradeoff**: Tokens can't be invalidated immediately; mitigated by short expiry and refresh token rotation

### 2. Server-Side Filtering

**Why**: Reduces data transfer, better performance with 500+ transactions, enforces business rules
**Tradeoff**: More backend load; mitigated by proper indexes and pagination

### 3. Redux for State Management

**Why**: Centralized auth state, easy to persist, good DevTools experience
**Tradeoff**: Boilerplate code; necessary for professional applications

### 4. Monorepo Structure

**Why**: Unified version control, easier type sharing, single deployment
**Tradeoff**: Can become complex at scale; acceptable for this project scope

### 5. Custom CSS with Theme System

**Why**: Lightweight, full control over styling, no vendor lock-in
**Tradeoff**: More CSS to write; justified by clean, professional design requirement

### 6. Status Timeline as Separate Collection

**Why**: Audit trail, immutable history, queryable timeline
**Tradeoff**: Denormalization; justified by the importance of transaction history

---

## Known Limitations & Future Enhancements

### Current Limitations

1. Single merchant account per session (multi-tenant support out of scope)
2. Refund timeline doesn't track refund approval workflow (only creation)
3. No email notifications for refund status changes
4. No bulk refund operations

### Possible Enhancements

1. Partial refund tracking and multiple refunds per transaction
2. Refund approval workflow with admin dashboard
3. Email notifications for status changes
4. Export transactions to CSV
5. Analytics dashboard for refund trends
6. Two-factor authentication for merchants
7. Audit log visibility for merchants

---

## Environment Variables

### Backend (.env)

```
NODE_ENV=production
PORT=5000
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=<long-random-secret>
REFRESH_TOKEN_EXPIRES_IN=30d
CORS_ORIGIN=https://merchant-refund-portal.vercel.app
```

### Frontend (.env.local)

```
VITE_API_URL=https://merchant-refund-portal-9q1b.onrender.com
```

---

## Contact & Support

For questions or issues, please refer to the GitHub repository and raise an issue.

---

**Last Updated**: March 10, 2026
**Status**: Production Ready
