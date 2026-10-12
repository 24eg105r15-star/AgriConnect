
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sprout,
  ShoppingBasket,
  TrendingUp,
  Package,
  RefreshCw,
  LogOut,
  Search,
  AlertCircle,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

export default function BuyerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("/api/orders/my");

      const items = Array.isArray(response)
        ? response
        : response?.content ?? response?.items ?? response?.orders ?? [];

      if (!Array.isArray(items)) {
        throw new Error("Unexpected response received from the orders API.");
      }

      setOrders(items);
    } catch (err) {
      setError(err.message || "Could not load your orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

const pendingOrders = orders.filter(
  (order) => normalizeStatus(order) === "PENDING"
);

const completedOrders = orders.filter(
  (order) => normalizeStatus(order) === "COMPLETED"
);

const totalQuantityPurchased = completedOrders.reduce(
  (total, order) => total + getQuantity(order),
  0
);

const totalCompletedOrderValue = completedOrders.reduce(
  (total, order) => {
    const price = Number(order.agreedPricePerQuintal);

    return Number.isFinite(price) && price > 0
      ? total + getQuantity(order) * price
      : total;
  },
  0
);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function getOrderId(order) {
    return order.id ?? order.orderId ?? "—";
  }

  function getCropName(order) {
    return (
      order.cropName ??
      order.listing?.cropName ??
      order.listing?.crop?.name ??
      order.crop?.name ??
      "Crop"
    );
  }

  function getStatus(order) {
    return order.status ?? order.orderStatus ?? "PROCESSING";
  }
      
function getQuantity(order) {
  return Number(
    order.quantityRequestedQuintals ??
    order.quantityQuintals ??
    order.quantity ??
    0
  );
}

function getOfferedPrice(order) {
  return Number(order.offeredPricePerQuintal ?? 0);
}

function formatPrice(value) {
  const amount = Number(value);

  return Number.isFinite(amount)
    ? `₹${amount.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`
    : "₹0";
}

function normalizeStatus(order) {
  return String(getStatus(order)).toUpperCase();
}

  function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleDateString("en-IN");
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate("/")} style={styles.brand}>
          <Sprout size={28} />
          <span>AgriConnect</span>
        </button>

        <div style={styles.headerRight}>
  <span style={styles.userName}>
    {user?.name || "Buyer"}
  </span>

  <button
    onClick={() => navigate("/profile")}
    style={styles.logout}
  >
    <UserRound size={17} />
    Profile
  </button>

  <button onClick={handleLogout} style={styles.logout}>
    <LogOut size={17} />
    Logout
  </button>
</div>
      </header>

      <section style={styles.content}>
        <div style={styles.welcome}>
          <p style={styles.eyebrow}>BUYER WORKSPACE</p>
          <h1>Welcome, {user?.name || "Buyer"}!</h1>
          <p>
            Discover fresh crops, compare prices, and manage your orders.
          </p>
        </div>

        <div style={styles.actions}>
          <button
            onClick={() => navigate("/marketplace")}
            style={styles.primaryButton}
          >
            <Search size={19} />
            Explore Marketplace
          </button>

          <button
            onClick={() => navigate("/prices")}
            style={styles.secondaryButton}
          >
            <TrendingUp size={19} />
            Compare Market Prices
          </button>
        </div>

       
<div style={styles.statsGrid}>
  <article style={styles.statCard}>
    <div style={styles.statIcon}>
      <Package size={24} />
    </div>
    <p style={styles.statLabel}>Total Orders</p>
    <h2 style={styles.statValue}>
      {loading ? "—" : orders.length}
    </h2>
    <p style={styles.statHint}>All orders placed</p>
  </article>

  <article style={styles.statCard}>
    <div style={styles.statIcon}>
      <ShoppingBasket size={24} />
    </div>
    <p style={styles.statLabel}>Pending Orders</p>
    <h2 style={styles.statValue}>
      {loading ? "—" : pendingOrders.length}
    </h2>
    <p style={styles.statHint}>Awaiting an initial decision</p>
  </article>

  <article style={styles.statCard}>
    <div style={styles.statIcon}>
      <TrendingUp size={24} />
    </div>
    <p style={styles.statLabel}>Completed Purchases</p>
    <h2 style={styles.statValue}>
      {loading ? "—" : completedOrders.length}
    </h2>
    <p style={styles.statHint}>Orders marked completed</p>
  </article>

  <article style={styles.statCard}>
    <div style={styles.statIcon}>
      <Sprout size={24} />
    </div>
    <p style={styles.statLabel}>Quantity Purchased</p>
    <h2 style={styles.statValue}>
      {loading
        ? "—"
        : `${totalQuantityPurchased.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })} q`}
    </h2>
    <p style={styles.statHint}>From completed orders</p>
  </article>

  <article style={styles.statCard}>
    <div style={styles.statIcon}>
      <TrendingUp size={24} />
    </div>
    <p style={styles.statLabel}>Completed Order Value</p>
    <h2 style={styles.statValue}>
      {loading ? "—" : formatPrice(totalCompletedOrderValue)}
    </h2>
    <p style={styles.statHint}>Completed orders with agreed prices</p>
  </article>
</div>


        <section style={styles.ordersSection}>
          <div style={styles.sectionHeader}>
            <div>
              <h2>My Orders</h2>
              <p>Review your orders placed through AgriConnect.</p>
            </div>

            <button
              onClick={loadOrders}
              disabled={loading}
              style={styles.refreshButton}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading && (
            <p style={styles.message}>Loading your orders...</p>
          )}

          {!loading && error && (
            <div role="alert" style={styles.error}>
              <AlertCircle size={20} />
              <div>
                <strong>Unable to load orders</strong>
                <p>{error}</p>
                <button onClick={loadOrders} style={styles.retryButton}>
                  Try again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div style={styles.empty}>
              <ShoppingBasket size={38} />
              <h3>No orders yet</h3>
              <p>
                Explore available crops and place your first order.
              </p>

              <button
                onClick={() => navigate("/marketplace")}
                style={styles.primaryButton}
              >
                Browse Crops
              </button>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div style={styles.orderGrid}>
              {orders.map((order, index) => (
                <article
                  key={getOrderId(order) === "—" ? index : getOrderId(order)}
                  style={styles.orderCard}
                >
                  <div style={styles.orderHeader}>
                    <span style={styles.orderNumber}>
                      Order #{getOrderId(order)}
                    </span>

                    <span style={styles.status}>
                      {getStatus(order)}
                    </span>
                  </div>

                  <h3 style={styles.cropName}>
                    {getCropName(order)}
                  </h3>

                 <p style={styles.detail}>
  Quantity:{" "}
  {order.quantityRequestedQuintals ??
    order.quantityQuintals ??
    order.quantity ??
    "Not specified"}
  {(order.quantityRequestedQuintals != null ||
    order.quantityQuintals != null ||
    order.quantity != null) && " quintals"}
</p>

                  <p style={styles.detail}>
                    Order date:{" "}
                    {formatDate(
                      order.createdAt ?? order.orderDate
                    )}
                  </p>

                  <p style={styles.price}>
  {order.totalAmount != null
    ? `₹${Number(order.totalAmount).toLocaleString("en-IN")}`
    : order.quantityRequestedQuintals != null &&
        order.offeredPricePerQuintal != null
      ? `₹${(
          Number(order.quantityRequestedQuintals) *
          Number(order.offeredPricePerQuintal)
        ).toLocaleString("en-IN")}`
      : "Amount not available"}
</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <footer style={styles.footer}>
          Signed in as {user?.email || "Buyer"}
        </footer>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f8f1",
    color: "#183b24",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    minHeight: "76px",
    padding: "14px 5%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    boxSizing: "border-box",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#15803d",
    fontWeight: 700,
    fontSize: "23px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
  },
  userName: {
    color: "#475569",
    fontSize: "14px",
  },
  logout: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    background: "#fff",
    cursor: "pointer",
  },
  content: {
    width: "min(1120px, 92%)",
    margin: "0 auto",
    padding: "38px 0",
    boxSizing: "border-box",
  },
  welcome: {
    marginBottom: "24px",
  },
  eyebrow: {
    color: "#15803d",
    fontWeight: 700,
    fontSize: "12px",
    letterSpacing: "1.5px",
  },
  subtitle: {
    color: "#64748b",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "25px",
  },
  primaryButton: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    padding: "13px 17px",
    border: "none",
    borderRadius: "9px",
    background: "#15803d",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    border: "1px solid #bbf7d0",
    borderRadius: "9px",
    background: "#fff",
    color: "#166534",
    fontWeight: 700,
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
    marginBottom: "28px",
  },
  statCard: {
    padding: "22px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
  },
  statIcon: {
    width: "45px",
    height: "45px",
    display: "grid",
    placeItems: "center",
    borderRadius: "12px",
    background: "#dcfce7",
    color: "#15803d",
  },
  statLabel: {
    color: "#64748b",
    margin: "16px 0 7px",
    fontSize: "14px",
  },
  statValue: {
    margin: 0,
    fontSize: "27px",
  },
  ordersSection: {
    padding: "24px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "15px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "10px 13px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
  },
  message: {
    padding: "25px 10px",
    textAlign: "center",
    color: "#64748b",
  },
  empty: {
    textAlign: "center",
    padding: "35px 10px",
    color: "#64748b",
  },
  error: {
    display: "flex",
    gap: "12px",
    color: "#b91c1c",
    background: "#fef2f2",
    borderRadius: "10px",
    padding: "17px",
    overflowWrap: "anywhere",
  },
  retryButton: {
    padding: "8px 12px",
    border: "1px solid #fecaca",
    borderRadius: "7px",
    background: "#fff",
    color: "#991b1b",
    cursor: "pointer",
  },
  orderGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))",
    gap: "16px",
  },
  orderCard: {
    minWidth: 0,
    padding: "18px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflowWrap: "anywhere",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  orderNumber: {
    color: "#64748b",
    fontSize: "12px",
  },
  status: {
    padding: "5px 8px",
    color: "#166534",
    background: "#f0fdf4",
    borderRadius: "6px",
    fontSize: "11px",
  },
  cropName: {
    margin: "17px 0 12px",
  },
  detail: {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.5,
  },
  price: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#15803d",
  },
  footer: {
    marginTop: "20px",
    color: "#64748b",
    fontSize: "13px",
    overflowWrap: "anywhere",
  },
  
statHint: {
  color: "#94a3b8",
  fontSize: "12px",
  margin: "8px 0 0",
  lineHeight: 1.5,
},

};
