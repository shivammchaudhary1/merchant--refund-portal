import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import TransactionDetail from "../pages/TransactionDetail";
import ExampleNotifications from "../components/common/ExampleNotifications";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Accessible to everyone */}
      <Route path="/" element={<Home />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes - Require authentication */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transaction/:id"
        element={
          <ProtectedRoute>
            <TransactionDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test"
        element={
          <ProtectedRoute>
            <ExampleNotifications />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
