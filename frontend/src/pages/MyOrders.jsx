import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../services/api";
import AppHeader from "../components/AppHeader";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/PageState";
import "./Workspace.css";

function formatPrice(value) {
  if (value == null) return "—";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/api/orders/my");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div className="workspace-page">
      <AppHeader />

      <main className="workspace-main">
        <div className="workspace-title">
          <span className="workspace-eyebrow">ORDER MANAGEMENT</span>
          <h1>My orders</h1>
          <p>Review the order requests associated with your buyer account.</p>
        </div>

        <div className="workspace-actions">
          <Link className="workspace-button" to="/marketplace">
            Browse marketplace
          </Link>
        </div>

        {loading ? (
          <LoadingState message="Loading your orders..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadOrders} />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            message="Browse the marketplace to find crops and place your first order."
          />
        ) : (
          <section className="workspace-panel">
            <div className="workspace-table-wrapper">
              <table className="workspace-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Crop</th>
                    <th>Farmer</th>
                    <th>Quantity</th>
                    <th>Offered price</th>
                    <th>Agreed price</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id}</td>
                      <td>{order.cropName || "—"}</td>
                      <td>{order.farmerName || "—"}</td>
                      <td>{order.quantityRequestedQuintals ?? "—"}</td>
                      <td>{formatPrice(order.offeredPricePerQuintal)}</td>
                      <td>{formatPrice(order.agreedPricePerQuintal)}</td>
                      <td>
                        <span className="workspace-badge">
                          {order.status || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}