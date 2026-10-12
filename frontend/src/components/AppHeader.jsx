import { Link, useNavigate } from "react-router-dom";
import { Sprout, LogOut, UserRound } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header className="workspace-header">
      <Link to="/" className="workspace-brand">
        <span className="workspace-brand-icon">
          <Sprout size={23} />
        </span>
        <span>
          Agri<span>Connect</span>
        </span>
      </Link>

      <nav className="workspace-nav">
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/prices">Crop prices</Link>

        {user?.role === "FARMER" && (
          <Link to="/farmer/dashboard">My dashboard</Link>
        )}

        {user?.role === "BUYER" && (
          <Link to="/buyer/dashboard">My dashboard</Link>
        )}

        {user && (
          <Link to="/profile">
            <UserRound size={15} />
            Profile
          </Link>
        )}
      </nav>

      <div className="workspace-account">
        {user ? (
          <>
            <span className="workspace-user-name">
              {user.name || user.role}
            </span>
            <button className="workspace-button workspace-button-light"
              onClick={handleLogout}>
              <LogOut size={15} />
              Log out
            </button>
          </>
        ) : (
          <Link className="workspace-button" to="/login">
            Log in
          </Link>
        )}
      </div>
    </header>
  );
}