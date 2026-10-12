
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sprout, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import {
  useAuth,
  getDashboardPath,
} from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 
async function handleSubmit(event) {
  event.preventDefault();
  setError("");
  setLoading(true);

  try {
    const response = await login(email.trim(), password);

    const savedUser = JSON.parse(
      localStorage.getItem("agriUser") || "null"
    );

    const role = String(
      response?.role || savedUser?.role || ""
    ).toUpperCase();

    if (role === "BUYER") {
      navigate("/buyer", { replace: true });
    } else if (role === "FARMER") {
      navigate("/farmer", { replace: true });
    } else if (role === "ADMIN") {
      navigate("/dashboard", { replace: true });
    } else {
      setError("Your account role could not be identified.");
    }
  } catch (err) {
    setError(err.message || "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
}


  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <Link to="/" style={styles.backLink}>
          <ArrowLeft size={18} /> Back to home
        </Link>

        <div style={styles.logo}>
          <Sprout size={32} />
        </div>

        <h1 style={styles.heading}>Welcome back!</h1>
        <p style={styles.subtitle}>
          Login to your AgriConnect account.
        </p>

        {error && (
          <div role="alert" style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={styles.label}>
            Email address
          </label>

          <div style={styles.inputWrapper}>
            <Mail size={19} color="#6b7280" />
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              style={styles.input}
            />
          </div>

          <label htmlFor="password" style={styles.label}>
            Password
          </label>

          <div style={styles.inputWrapper}>
            <Lock size={19} color="#6b7280" />

            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              style={styles.input}
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              style={styles.eyeButton}
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>

          <button type="submit" disabled={loading} style={styles.submit}>
            {loading ? "Logging in..." : "Login to AgriConnect"}
          </button>
        </form>

        <p style={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.link}>
            Sign up
          </Link>
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    background: "linear-gradient(135deg, #f0fdf4, #dcfce7, #f8fafc)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    background: "#ffffff",
    padding: "32px",
    borderRadius: "20px",
    boxShadow: "0 15px 45px rgba(22, 101, 52, 0.12)",
    boxSizing: "border-box",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#4b5563",
    textDecoration: "none",
    fontSize: "14px",
  },
  logo: {
    width: "62px",
    height: "62px",
    display: "grid",
    placeItems: "center",
    background: "#dcfce7",
    color: "#15803d",
    borderRadius: "18px",
    margin: "28px auto 16px",
  },
  heading: {
    textAlign: "center",
    margin: "0 0 10px",
    color: "#14532d",
    fontSize: "29px",
  },
  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: "28px",
  },
  label: {
    display: "block",
    margin: "18px 0 8px",
    color: "#374151",
    fontSize: "14px",
    fontWeight: 600,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    padding: "0 12px",
    background: "#fff",
  },
  input: {
    width: "100%",
    minWidth: 0,
    border: "none",
    outline: "none",
    padding: "14px 0",
    fontSize: "15px",
    background: "transparent",
    color: "#111827",
  },
  eyeButton: {
    border: "none",
    background: "transparent",
    color: "#6b7280",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    padding: "5px",
  },
  submit: {
    width: "100%",
    marginTop: "26px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#15803d",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  error: {
    background: "#fef2f2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
  },
  footerText: {
    textAlign: "center",
    color: "#64748b",
    marginTop: "24px",
    fontSize: "14px",
  },
  link: {
    color: "#15803d",
    fontWeight: 700,
    textDecoration: "none",
  },
};
