
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sprout,
  Plus,
  RefreshCw,
  LogOut,
  ShoppingBasket,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [salesSummary, setSalesSummary] = useState(null);
  const [salesLoading, setSalesLoading] = useState(true);
  const [salesError, setSalesError] = useState("");
  
const [orders, setOrders] = useState([]);
const [ordersLoading, setOrdersLoading] = useState(true);
const [ordersError, setOrdersError] = useState("");

const loadOrders = useCallback(async () => {
  setOrdersLoading(true);
  setOrdersError("");

  try {
    const response = await apiRequest("/api/orders/farmer/my");

    const items = Array.isArray(response)
      ? response
      : response?.content ?? response?.items ?? [];

    if (!Array.isArray(items)) {
      throw new Error("Unexpected response from the orders API.");
    }

    setOrders(items);
  } catch (err) {
    setOrdersError(err.message || "Could not load incoming orders.");
  } finally {
    setOrdersLoading(false);
  }
}, []);

  const loadListings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("/api/listings/my");

      const items = Array.isArray(response)
        ? response
        : response?.content ??
          response?.items ??
          response?.listings ??
          [];

      if (!Array.isArray(items)) {
        throw new Error("Unexpected response received from the listings API.");
      }

      setListings(items);
    } catch (err) {
      setError(err.message || "Could not load your crop listings.");
    } finally {
      setLoading(false);
    }
  }, []);
      
const loadSalesSummary = useCallback(async () => {
  setSalesLoading(true);
  setSalesError("");

  try {
    const response = await apiRequest(
      "/api/orders/farmer/sales-summary"
    );

    setSalesSummary(response);
  } catch (err) {
    setSalesError(
      err.message || "Could not load your sales summary."
    );
    setSalesSummary(null);
  } finally {
    setSalesLoading(false);
  }
}, []);

  
useEffect(() => {
  loadListings();
  loadSalesSummary();
  loadOrders();
}, [loadListings, loadSalesSummary, loadOrders]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function getCropName(listing) {
    return (
      listing.cropName ??
      listing.crop?.name ??
      listing.crop?.cropName ??
      listing.name ??
      "Crop"
    );
  }

  function getQuantity(listing) {
    return (
      listing.quantityQuintals ??
      listing.availableQuantityQuintals ??
      listing.quantity ??
      null
    );
  }


function getPrice(listing) {
  return (
    listing.askingPricePerQuintal ??
    listing.pricePerQuintal ??
    listing.expectedPricePerQuintal ??
    listing.price ??
    null
  );
}


  function formatPrice(price) {
    if (price === null || price === undefined || price === "") {
      return "Not specified";
    }

    const number = Number(price);

    return Number.isFinite(number)
      ? `₹${number.toLocaleString("en-IN")}`
      : String(price);
  }
  
function formatQuantity(value) {
  const number = Number(value ?? 0);

  return Number.isFinite(number)
    ? number.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })
    : "0";
}

  
  function getListingStatus(listing) {
    return String(listing.status ?? "ACTIVE").toUpperCase();
  }

  const activeListings = listings.filter(
    (listing) => getListingStatus(listing) === "ACTIVE"
  );

  const totalAvailableQuantity = activeListings.reduce(
    (total, listing) => {
      const quantity = Number(getQuantity(listing));
      return total + (Number.isFinite(quantity) && quantity > 0 ? quantity : 0);
    },
    0
  );

  const prices = activeListings
    .map((listing) => Number(getPrice(listing)))
    .filter((price) => Number.isFinite(price) && price > 0);

  const averagePrice =
    prices.length > 0
      ? prices.reduce((total, price) => total + price, 0) / prices.length
      : null;


  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <button
          type="button"
          onClick={() => navigate("/")}
          style={styles.brand}
        >
          <Sprout size={29} />
          <span>AgriConnect</span>
        </button>

        <div style={styles.headerRight}>
          <span style={styles.userName}>
            {user?.name || "Farmer"}
          </span>
          <button onClick={handleLogout} style={styles.logout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      <section style={styles.content}>
        <div style={styles.welcomeRow}>
          <div>
            <p style={styles.eyebrow}>FARMER WORKSPACE</p>
            <h1 style={styles.title}>
              Welcome, {user?.name || "Farmer"}!
            </h1>
            <p style={styles.subtitle}>
              Manage your crop listings and connect with buyers.
            </p>
          </div>

          <button
            onClick={() => navigate("/listing/new")}
            style={styles.primaryButton}
          >
            <Plus size={19} />
            Add Crop Listing
          </button>
        </div>

        
  <div style={styles.statsGrid}>
    <article style={styles.statCard}>
      <div style={styles.statIcon}>
        <ShoppingBasket size={23} />
      </div>
      <p style={styles.statLabel}>Total Listings</p>
      <h2 style={styles.statValue}>
        {loading ? "—" : listings.length}
      </h2>
      <p style={styles.statHint}>All your crop listings</p>
    </article>

    <article style={styles.statCard}>
      <div style={styles.statIcon}>
        <Sprout size={23} />
      </div>
      <p style={styles.statLabel}>Active Listings</p>
      <h2 style={styles.statValue}>
        {loading ? "—" : activeListings.length}
      </h2>
      <p style={styles.statHint}>Currently available for buyers</p>
    </article>

    <article style={styles.statCard}>
      <div style={styles.statIcon}>
        <TrendingUp size={23} />
      </div>
      <p style={styles.statLabel}>Available Quantity</p>
      <h2 style={styles.statValue}>
        {loading
          ? "—"
          : `${Number(totalAvailableQuantity.toFixed(2)).toLocaleString("en-IN")} q`}
      </h2>
      <p style={styles.statHint}>Across active listings</p>
    </article>

    <article style={styles.statCard}>
      <div style={styles.statIcon}>
        <TrendingUp size={23} />
      </div>
      <p style={styles.statLabel}>Average Asking Price</p>
      <h2 style={styles.statValue}>
        {loading
          ? "—"
          : averagePrice === null
            ? "—"
            : formatPrice(Math.round(averagePrice))}
      </h2>
      <p style={styles.statHint}>Per quintal, active listings</p>
    </article>
  </div>

<section style={styles.salesSection}>
  <div style={styles.sectionHeader}>
    <div>
      <h2 style={styles.sectionTitle}>Sales Overview</h2>
      <p style={styles.sectionSubtitle}>
        Order and revenue statistics from your completed orders.
      </p>
    </div>

    <button
      type="button"
      onClick={loadSalesSummary}
      disabled={salesLoading}
      style={styles.refreshButton}
    >
      <RefreshCw size={16} />
      Refresh Sales
    </button>
  </div>

  {salesLoading && (
    <p style={styles.message}>Loading sales summary...</p>
  )}

  {!salesLoading && salesError && (
    <div role="alert" style={styles.error}>
      <AlertCircle size={20} />
      <div>
        <strong>Could not load sales summary</strong>
        <p style={styles.errorText}>{salesError}</p>
        <button
          type="button"
          onClick={loadSalesSummary}
          style={styles.retryButton}
        >
          Try again
        </button>
      </div>
    </div>
  )}

  {!salesLoading && !salesError && salesSummary && (
    <div style={styles.statsGrid}>
      <article style={styles.statCard}>
        <p style={styles.statLabel}>Total Orders</p>
        <h2 style={styles.statValue}>
          {salesSummary.totalOrders ?? 0}
        </h2>
        <p style={styles.statHint}>All orders received</p>
      </article>

      <article style={styles.statCard}>
        <p style={styles.statLabel}>Pending Orders</p>
        <h2 style={styles.statValue}>
          {salesSummary.pendingOrders ?? 0}
        </h2>
        <p style={styles.statHint}>Awaiting an initial decision</p>
      </article>

      <article style={styles.statCard}>
        <p style={styles.statLabel}>Completed Orders</p>
        <h2 style={styles.statValue}>
          {salesSummary.completedOrders ?? 0}
        </h2>
        <p style={styles.statHint}>Marked as completed</p>
      </article>

      <article style={styles.statCard}>
        <p style={styles.statLabel}>Quantity Sold</p>
        <h2 style={styles.statValue}>
          {formatQuantity(salesSummary.totalQuantitySold)} q
        </h2>
        <p style={styles.statHint}>From completed orders</p>
      </article>

      <article style={styles.statCard}>
        <p style={styles.statLabel}>Total Sales Revenue</p>
        <h2 style={styles.statValue}>
          {formatPrice(salesSummary.totalRevenue)}
        </h2>
        <p style={styles.statHint}>Completed orders with agreed prices</p>
      </article>
    </div>
  )}
</section>


<section style={styles.salesSection}>
  <div style={styles.sectionHeader}>
    <div>
      <h2 style={styles.sectionTitle}>Incoming Orders</h2>
      <p style={styles.sectionSubtitle}>
        Review orders from buyers and respond to their requests.
      </p>
    </div>

    <button
      type="button"
      onClick={loadOrders}
      disabled={ordersLoading}
      style={styles.refreshButton}
    >
      <RefreshCw size={16} />
      Refresh Orders
    </button>
  </div>

  {ordersLoading && (
    <p style={styles.message}>Loading incoming orders...</p>
  )}

  {!ordersLoading && ordersError && (
    <div role="alert" style={styles.error}>
      <AlertCircle size={20} />
      <div>
        <strong>Could not load incoming orders</strong>
        <p style={styles.errorText}>{ordersError}</p>
        <button
          type="button"
          onClick={loadOrders}
          style={styles.retryButton}
        >
          Try again
        </button>
      </div>
    </div>
  )}

  {!ordersLoading && !ordersError && orders.length === 0 && (
    <div style={styles.empty}>
      <ShoppingBasket size={35} />
      <h3>No incoming orders yet</h3>
      <p>Buyer orders will appear here when they order your crops.</p>
    </div>
  )}

  {!ordersLoading && !ordersError && orders.length > 0 && (
    <div style={styles.listingGrid}>
      {orders.map((order, index) => {
        const orderId = order.id ?? order.orderId ?? index;
        const status = String(order.status ?? "PENDING").toUpperCase();

        return (
          <article key={orderId} style={styles.listingCard}>
            <div style={styles.cropIcon}>
              <ShoppingBasket size={25} />
            </div>

            <div style={styles.cropHeading}>
              <h3>Order #{orderId}</h3>
              <span style={styles.status}>{status.replaceAll("_", " ")}</span>
            </div>

            <div style={styles.cropDetails}>
              <p>
                <span>Crop</span>
                <strong>
                  {order.cropName ??
                    order.listing?.cropName ??
                    order.listing?.crop?.name ??
                    order.listing?.name ??
                    "Crop"}
                </strong>
              </p>

              <p>
                <span>Quantity</span>
                <strong>
                  {order.quantityRequestedQuintals ??
                    order.quantityQuintals ??
                    order.quantity ??
                    "—"}{" "}
                  quintals
                </strong>
              </p>

              <p>
                <span>Offered price</span>
                <strong>
                  {formatPrice(
                    order.offeredPricePerQuintal ??
                      order.pricePerQuintal ??
                      order.offeredPrice
                  )}
                </strong>
              </p>
            </div>

            <p style={styles.description}>
              Buyer: {order.buyerName ?? order.buyer?.name ?? "Buyer"}
            </p>

            <p style={styles.description}>
              
{status === "PENDING" && (
  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px" }}>
    <button
      type="button"
      style={{ ...styles.editButton, marginTop: 0 }}
      onClick={async () => {
        const confirmed = window.confirm("Accept this order at the buyer's offered price?");
        if (!confirmed) return;

        try {
          await apiRequest(`/api/orders/${orderId}/accept`, {
            method: "PUT",
          });
          await loadOrders();
          await loadSalesSummary();
        } catch (err) {
          window.alert(err.message || "Could not accept the order.");
        }
      }}
    >
      Accept Order
    </button>

    <button
      type="button"
      style={{ ...styles.editButton, marginTop: 0, color: "#b91c1c", borderColor: "#fecaca", background: "#fef2f2" }}
      onClick={async () => {
        const confirmed = window.confirm("Are you sure you want to reject this order?");
        if (!confirmed) return;

        try {
          await apiRequest(`/api/orders/${orderId}/reject`, {
            method: "PUT",
          });
          await loadOrders();
          await loadSalesSummary();
        } catch (err) {
          window.alert(err.message || "Could not reject the order.");
        }
      }}
    >
      Reject Order
    </button>

    <button
      type="button"
      style={{ ...styles.editButton, marginTop: 0, color: "#1d4ed8", borderColor: "#bfdbfe", background: "#eff6ff" }}
      onClick={async () => {
        const input = window.prompt("Enter your counter-offer price per quintal (₹):");
        if (input === null) return;

        const price = Number(input);
        if (!Number.isFinite(price) || price <= 0) {
          window.alert("Enter a valid price greater than zero.");
          return;
        }

        try {
          await apiRequest(`/api/orders/${orderId}/counter-offer`, {
            method: "PUT",
            body: JSON.stringify({
              counterOfferPricePerQuintal: price,
            }),
          });
          await loadOrders();
          await loadSalesSummary();
        } catch (err) {
          window.alert(err.message || "Could not submit the counter-offer.");
        }
      }}
    >
      Counter Offer
    </button>
  </div>
)}

            </p>
          </article>
        );
      })}
    </div>
  )}
</section>

        <section style={styles.listingsSection}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>My Crop Listings</h2>
              <p style={styles.sectionSubtitle}>
                Your listings retrieved from the backend.
              </p>
            </div>

            <button
              onClick={loadListings}
              disabled={loading}
              style={styles.refreshButton}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading && (
            <div style={styles.message}>
              Loading your crop listings...
            </div>
          )}

          {!loading && error && (
            <div role="alert" style={styles.error}>
              <AlertCircle size={20} />
              <div>
                <strong>Could not load listings</strong>
                <p style={styles.errorText}>{error}</p>
                <button onClick={loadListings} style={styles.retryButton}>
                  Try again
                </button>
              </div>
            </div>
          )}

          {!loading && !error && listings.length === 0 && (
            <div style={styles.empty}>
              <Sprout size={35} />
              <h3>No crop listings yet</h3>
              <p>
                Add your first crop listing to get started.
              </p>
              <button
                onClick={() => navigate("/listing/new")}
                style={styles.primaryButton}
              >
                <Plus size={18} />
                Add Your First Crop
              </button>
            </div>
          )}

          {!loading && !error && listings.length > 0 && (
            <div style={styles.listingGrid}>
              {listings.map((listing, index) => {
                const id = listing.id ?? listing.listingId ?? index;
                const quantity = getQuantity(listing);
                const price = getPrice(listing);

                return (
                  <article key={id} style={styles.listingCard}>
                    <div style={styles.cropIcon}>
                      <Sprout size={25} />
                    </div>

                    <div style={styles.cropHeading}>
                      <h3>{getCropName(listing)}</h3>
                      <span style={styles.status}>
                        {listing.status || "Listed"}
                      </span>
                    </div>

                    <div style={styles.cropDetails}>
                      <p>
                        <span>Quantity</span>
                        <strong>
                          {quantity == null
                            ? "Not specified"
                            : `${quantity} quintals`}
                        </strong>
                      </p>
                      <p>
                        <span>Price per quintal</span>
                        <strong>{formatPrice(price)}</strong>
                      </p>
                    </div>

                    {listing.description && (
                      <p style={styles.description}>
                        {listing.description}
                      </p>
                    )}
                    <button
  type="button"
  onClick={() =>
    navigate(`/listing/edit/${listing.id ?? listing.listingId}`)
  }
  style={styles.editButton}
>
  Edit Listing
</button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer style={styles.footer}>
          Logged in as {user?.email || "Farmer"}
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
    gap: "16px",
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
  welcomeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "22px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },
  eyebrow: {
    fontSize: "12px",
    color: "#15803d",
    fontWeight: 700,
    letterSpacing: "1.5px",
  },
  title: {
    fontSize: "clamp(25px, 4vw, 35px)",
    margin: "8px 0",
    overflowWrap: "anywhere",
  },
  subtitle: {
    color: "#64748b",
    lineHeight: 1.6,
    margin: 0,
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "13px 17px",
    color: "#fff",
    background: "#15803d",
    border: "none",
    borderRadius: "9px",
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
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "22px",
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
    fontSize: "27px",
    margin: 0,
    overflowWrap: "anywhere",
  },
  listingsSection: {
    padding: "24px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "15px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },
  sectionTitle: {
    margin: "0 0 6px",
    fontSize: "21px",
  },
  sectionSubtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
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
    padding: "30px 10px",
    textAlign: "center",
    color: "#64748b",
  },
  error: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    background: "#fef2f2",
    color: "#b91c1c",
    borderRadius: "10px",
    padding: "18px",
    overflowWrap: "anywhere",
  },
  errorText: {
    margin: "8px 0",
    lineHeight: 1.5,
  },
  retryButton: {
    marginTop: "5px",
    padding: "8px 12px",
    border: "1px solid #fecaca",
    background: "#fff",
    color: "#991b1b",
    borderRadius: "7px",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "38px 10px",
    color: "#64748b",
  },
  listingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(235px, 1fr))",
    gap: "17px",
  },
  listingCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "19px",
    minWidth: 0,
  },
  cropIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "grid",
    placeItems: "center",
    color: "#15803d",
    background: "#dcfce7",
  },
  cropHeading: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "14px",
  },
  status: {
    display: "inline-block",
    padding: "5px 8px",
    background: "#f0fdf4",
    color: "#166534",
    borderRadius: "6px",
    fontSize: "11px",
    overflowWrap: "anywhere",
  },
  cropDetails: {
    marginTop: "13px",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "10px",
  },
  description: {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.5,
  },
  footer: {
    marginTop: "20px",
    color: "#64748b",
    fontSize: "13px",
    overflowWrap: "anywhere",
  },
  editButton: {
  marginTop: "14px",
  padding: "10px 14px",
  border: "1px solid #15803d",
  borderRadius: "8px",
  background: "#f0fdf4",
  color: "#166534",
  fontWeight: 700,
  cursor: "pointer",
},

  statHint: {
    color: "#94a3b8",
    fontSize: "12px",
    margin: "8px 0 0",
    lineHeight: 1.5,
  },
  
salesSection: {
  marginBottom: "28px",
  padding: "24px",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "15px",
},

};
