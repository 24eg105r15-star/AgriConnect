
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem("agriUser");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem("agriUser");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  const saveSession = useCallback((response) => {
    if (response?.token) {
      localStorage.setItem("agriToken", response.token);
    }

    const userData = {
      userId: response?.userId ?? response?.id ?? null,
      name: response?.name ?? "",
      email: response?.email ?? "",
      role: response?.role ?? "",
    };

    localStorage.setItem("agriUser", JSON.stringify(userData));
    setUser(userData);

    return userData;
  }, []);

  const signup = useCallback(
    async (formData) => {
      const response = await apiRequest("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response?.token) {
        saveSession(response);
      }

      return response;
    },
    [saveSession]
  );

  const login = useCallback(
    async (email, password) => {
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (!response?.token) {
        throw new Error("Login response did not contain an authentication token.");
      }

      saveSession({ ...response, email: response.email ?? email });
      return response;
    },
    [saveSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("agriToken");
    localStorage.removeItem("agriUser");
    setUser(null);
  }, []);

  const value = {
    user,
    token: localStorage.getItem("agriToken"),
    isAuthenticated: Boolean(localStorage.getItem("agriToken")),
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export function getDashboardPath(role) {
  const normalizedRole = String(role || "").toUpperCase();

  if (normalizedRole === "FARMER") return "/farmer";
  if (normalizedRole === "BUYER") return "/buyer";
  if (normalizedRole === "ADMIN") return "/dashboard";

  return "/";
}
