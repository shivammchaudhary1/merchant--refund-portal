const config = {
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173",
  BACKEND_API: import.meta.env.VITE_BACKEND_API || "http://localhost:8080",
};

export default config;
