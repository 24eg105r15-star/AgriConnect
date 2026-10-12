
import { useNavigate } from "react-router-dom";
import { Sprout, LogOut, Home, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function RoleDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const role = String(user?.role || "").toUpperCase();
  const isFarmer = role === "FARMER";

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>
          <Sprout size={28} />
          <span>AgriConnect</span>
        </div>

        <button onClick={handleLogout} style={styles.logout}>
          <LogOut size={17} />
          Logout
        </button>
      </header>

      <section style={styles.content}>
        <div style={styles.icon}>
          {isFarmer ? <Sprout size={38} /> : <UserRound size={38} />}
        </div>

        <p style={styles.eyebrow}>
          {isFarmer ? "FARMER WORKSPACE" : "BUYER WORKSPACE"}
        </p>

        <h1 style={styles.title}>
          Welcome, {user?.name || "User"}!
        </h1>

        <p style={styles.description}>
          {isFarmer
            ? "Your AgriConnect account is ready. You will be able to manage crop listings, review orders, and connect directly with buyers."
            : "Your AgriConnect account is ready. You will be able to discover crops, compare market prices, and connect with farmers."}
        </p>

        <div style={styles.details}>
          <p><strong>Name:</strong> {user?.name || "Not provided"}</p>
          <p><strong>Email:</strong> {user?.email || "Not provided"}</p>
          <p><strong>Account type:</strong> {role || "Unknown"}</p>
        </div>

        <button onClick={() => navigate("/")} style={styles.homeButton}>
          <Home size={18} />
          Back to home
        </button>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f8f1",
    fontFamily: "Arial, sans-serif",
    color: "#183b24",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 6%",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#15803d",
    fontSize: "22px",
    fontWeight: 700,
  },
  logout: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 15px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
  },
  content: {
    maxWidth: "680px",
    margin: "55px auto",
    padding: "35px 25px",
    textAlign: "center",
    boxSizing: "border-box",
  },
  icon: {
    width: "78px",
    height: "78px",
    borderRadius: "22px",
    background: "#dcfce7",
    color: "#15803d",
    display: "grid",
    placeItems: "center",
    margin: "0 auto 20px",
  },
  eyebrow: {
    color: "#15803d",
    fontWeight: 700,
    fontSize: "13px",
    letterSpacing: "1.5px",
  },
  title: {
    fontSize: "clamp(27px, 5vw, 38px)",
    margin: "12px 0",
  },
  description: {
    color: "#64748b",
    lineHeight: 1.7,
    fontSize: "16px",
  },
  details: {
    marginTop: "28px",
    padding: "18px 22px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    textAlign: "left",
    overflowWrap: "anywhere",
  },
  homeButton: {
    marginTop: "20px",
    padding: "12px 20px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#15803d",
    color: "#fff",
    border: "none",
    borderRadius: "9px",
    cursor: "pointer",
  },
};
