// User roles
export const UserRole = {
  ADMIN: "admin",
  USER: "user",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// User data interface
export interface User {
  _id: string;
  businessName: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth state interface
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  role: string | null;
  email: string | null;
  loading: boolean;
  error: string | null;
}

// Login credentials interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data interface
export interface RegisterData {
  businessName: string;
  email: string;
  password: string;
  role?: UserRole;
}

// Config for async thunks
export interface AsyncThunkConfig {
  rejectValue: string;
}

// API Response interfaces
export interface AuthResponse {
  success: boolean;
  message: string;
  _id: string;
  businessName: string;
  email: string;
  role: string;
  name: string;
  token: string;
}

// API Error response
export interface ApiError {
  success: boolean;
  message: string;
  errors?: string[];
}

// Location state for login redirect
export interface LocationState {
  from?: {
    pathname: string;
  };
}
