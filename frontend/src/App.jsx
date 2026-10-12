
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Home from "./Home.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Signup from "./pages/Signup.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleDashboard from "./pages/RoleDashboard.jsx";
import FarmerDashboard from "./pages/FarmerDashboard.jsx";
import BuyerDashboard from "./pages/BuyerDashboard.jsx";
import ListingForm from "./pages/ListingForm.jsx";
import Marketplace from "./pages/Marketplace.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
function PlaceholderPage({ title, message }) {
  const navigate = useNavigate();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background: "#f4f8f1",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <section
        style={{
          background: "#fff",
          padding: "36px",
          borderRadius: "16px",
          textAlign: "center",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1>{title}</h1>
        <p>{message}</p>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#248232",
            color: "white",
            cursor: "pointer",
          }}
        >
          Back to home
        </button>

        <p style={{ marginTop: "20px" }}>
          <Link to="/login">Login</Link>
          {" | "}
          <Link to="/signup">Signup</Link>
        </p>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
            
<Route path="/" element={<Home />} />

<Route
  path="/marketplace"
  element={
    <ProtectedRoute allowedRoles={["BUYER"]}>
      <Marketplace />
    </ProtectedRoute>
  }
/>

<Route path="/login" element={<Login />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />
              <Route
  path="/profile"
  element={
    <ProtectedRoute allowedRoles={["BUYER", "FARMER"]}>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
          <Route
            path="/farmer"
            element={
              <ProtectedRoute allowedRoles={["FARMER"]}>
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer"
            element={
              <ProtectedRoute allowedRoles={["BUYER"]}>
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <RoleDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/listing/new"
            element={
              <ProtectedRoute allowedRoles={["FARMER"]}>
                <ListingForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/listing/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["FARMER"]}>
                <ListingForm />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
