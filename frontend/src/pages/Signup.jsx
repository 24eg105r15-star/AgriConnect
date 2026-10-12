
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sprout,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Tractor,
  ShoppingBasket,
  ArrowLeft,
} from "lucide-react";
import { useAuth, getDashboardPath } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("FARMER");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (response?.token) {
        navigate(getDashboardPath(response.role || role), {
          replace: true,
        });
      } else {
        setSuccess("Account created successfully. You can now log in.");
      }
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    minWidth: 0,
    border: "none",
    outline: "none",
    padding: "13px 0",
    fontSize: "15px",
    background: "transparent",
    color: "#111827",
    boxSizing: "border-box",
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <Link to="/" style={styles.backLink}>
          <ArrowLeft size={18} />
          Back to home
        </Link>

        <div style={styles.logo}>
          <Sprout size={32} />
        </div>

        <h1 style={styles.heading}>Join AgriConnect</h1>
        <p style={styles.subtitle}>
          Connect farmers and buyers in one marketplace.
        </p>

        {error && (
          <div role="alert" style={styles.error}>
            {error}
          </div>
        )}

        {success && (
          <div role="status" style={styles.success}>
            {success}{" "}
            <Link to="/login" style={styles.link}>
              Log in
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name" style={styles.label}>
            Full name
          </label>

          <div style={styles.inputWrapper}>
            <User size={19} color="#6b7280" />
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
              maxLength={100}
              style={inputStyle}
            />
          </div>

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
              style={inputStyle}
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
              placeholder="Create a password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
              style={inputStyle}
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

          <label style={styles.label}>I want to join as a</label>

          <div style={styles.roleGroup}>
            <button
              type="button"
              onClick={() => setRole("FARMER")}
              aria-pressed={role === "FARMER"}
              style={{
                ...styles.roleButton,
                ...(role === "FARMER" ? styles.selectedRole : {}),
              }}
            >
              <Tractor size={23} />
              <strong>Farmer</strong>
              <span style={styles.roleDescription}>
                Sell crops and manage listings
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRole("BUYER")}
              aria-pressed={role === "BUYER"}
              style={{
                ...styles.roleButton,
                ...(role === "BUYER" ? styles.selectedRole : {}),
              }}
            >
              <ShoppingBasket size={23} />
              <strong>Buyer</strong>
              <span style={styles.roleDescription}>
                Find crops and contact farmers
              </span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submit,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Login
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
    maxWidth: "470px",
    background: "#fff",
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
    margin: "24px auto 14px",
  },
  heading: {
    textAlign: "center",
    color: "#14532d",
    fontSize: "29px",
    margin: "0 0 10px",
  },
  subtitle: {
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: 1.5,
    marginBottom: "24px",
  },
  label: {
    display: "block",
    margin: "17px 0 8px",
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
  eyeButton: {
    border: "none",
    background: "transparent",
    color: "#6b7280",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    padding: "5px",
  },
  roleGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  roleButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "18px 10px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    background: "#fff",
    color: "#374151",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "14px",
  },
  selectedRole: {
    border: "2px solid #15803d",
    background: "#f0fdf4",
    color: "#166534",
  },
  roleDescription: {
    fontSize: "12px",
    fontWeight: 400,
    lineHeight: 1.4,
  },
  submit: {
    width: "100%",
    marginTop: "25px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#15803d",
    color: "#fff",
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
  success: {
    background: "#f0fdf4",
    color: "#166534",
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
