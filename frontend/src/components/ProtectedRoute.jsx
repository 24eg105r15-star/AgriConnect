
import { Navigate } from "react-router-dom";
import { useAuth, getDashboardPath } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = String(user.role || "").toUpperCase();

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={getDashboardPath(role)} replace />;
  }

  return children;
}
