import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import config from "../../config/config";
import type {
  AuthState,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AsyncThunkConfig,
  User,
  UserRole,
} from "../../types/auth.types";

// Helper function to safely parse JSON from localStorage
const parseStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem("mrpuser");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("mrptoken"),
  user: parseStoredUser(),
  token: localStorage.getItem("mrptoken"),
  role: localStorage.getItem("mrprole"),
  email: localStorage.getItem("mrpemail"),
  loading: false,
  error: null,
};

export const register = createAsyncThunk<
  AuthResponse,
  RegisterData,
  AsyncThunkConfig
>("auth/register", async (userData: RegisterData, { rejectWithValue }) => {
  try {
    const response = await fetch(`${config.BACKEND_API}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Registration failed");
    }

    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An unknown error occurred",
    );
  }
});

export const login = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  AsyncThunkConfig
>("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await fetch(`${config.BACKEND_API}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      return rejectWithValue(data.message || "Login failed");
    }

    return data;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "An unknown error occurred",
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.role = null;
      state.email = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("mrptoken");
      localStorage.removeItem("mrpuser");
      localStorage.removeItem("mrprole");
      localStorage.removeItem("mrpemail");
    },
    setLogin: (state, action: PayloadAction<AuthResponse>) => {
      state.isAuthenticated = true;
      state.user = {
        _id: action.payload._id,
        businessName: action.payload.name || action.payload.businessName,
        email: action.payload.email,
        role: action.payload.role as UserRole,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.loading = false;
      state.error = null;
      // Store in localStorage
      localStorage.setItem("mrptoken", action.payload.token);
      localStorage.setItem("mrpuser", JSON.stringify(state.user));
      localStorage.setItem("mrprole", action.payload.role);
      localStorage.setItem("mrpemail", action.payload.email);
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register cases
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          console.log("Register fulfilled:", action.payload);
          state.loading = false;
          state.isAuthenticated = true;
          state.user = {
            _id: action.payload._id,
            businessName: action.payload.name || action.payload.businessName,
            email: action.payload.email,
            role: action.payload.role as UserRole,
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          state.token = action.payload.token;
          state.role = action.payload.role;
          state.email = action.payload.email;
          state.error = null;
          // Store in localStorage
          localStorage.setItem("mrptoken", action.payload.token);
          localStorage.setItem("mrpuser", JSON.stringify(state.user));
          localStorage.setItem("mrprole", action.payload.role);
          localStorage.setItem("mrpemail", action.payload.email);
        },
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          console.log("Login fulfilled:", action.payload);
          state.loading = false;
          state.isAuthenticated = true;
          state.user = {
            _id: action.payload._id,
            businessName: action.payload.name || action.payload.businessName,
            email: action.payload.email,
            role: action.payload.role as UserRole,
            isVerified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          state.token = action.payload.token;
          state.role = action.payload.role;
          state.email = action.payload.email;
          state.error = null;
          // Store in localStorage
          localStorage.setItem("mrptoken", action.payload.token);
          localStorage.setItem("mrpuser", JSON.stringify(state.user));
          localStorage.setItem("mrprole", action.payload.role);
          localStorage.setItem("mrpemail", action.payload.email);
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { setLogout, setLogin, clearError, setLoading } =
  authSlice.actions;

// Import RootState from store
import type { RootState } from "../store";

// Typed selectors
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;
export const selectUser = (state: RootState): User | null => state.auth.user;
export const selectRole = (state: RootState): string | null => state.auth.role;
export const selectEmail = (state: RootState): string | null =>
  state.auth.email;
export const selectLoading = (state: RootState): boolean => state.auth.loading;
export const selectError = (state: RootState): string | null =>
  state.auth.error;

export default authSlice.reducer;
