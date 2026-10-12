import { useEffect, useState } from "react";

import { apiRequest } from "../services/api";
import AppHeader from "../components/AppHeader";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../components/PageState";
import "./Workspace.css";

function formatPrice(value) {
  if (value == null || value === "") return "—";

  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export default function MarketPrices() {
  const [prices, setPrices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  async function loadPrices() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/api/prices");
      setPrices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Unable to load crop prices.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrices();
  }, []);

  const filteredPrices = prices.filter((item) => {
    const query = search.toLowerCase();

    return [
      item.cropName,
      item.marketName,
      item.district,
      item.state,
      item.variety,
    ].some((value) => String(value || "").toLowerCase().includes(query));
  });

  return (
    <div className="workspace-page">
      <AppHeader />

      <main className="workspace-main">
        <div className="workspace-title">
          <span className="workspace-eyebrow">MARKET INFORMATION</span>
          <h1>Crop prices</h1>
          <p>
            Explore recorded crop prices by crop and market. Prices displayed
            here depend on the records available in your database.
          </p>
        </div>

        <div className="workspace-field" style={{ maxWidth: 480, marginBottom: 22 }}>
          <label htmlFor="price-search">Search crop or market</label>
          <input
            id="price-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="For example, rice or Warangal"
          />
        </div>

        {loading ? (
          <LoadingState message="Loading market prices..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadPrices} />
        ) : filteredPrices.length === 0 ? (
          <EmptyState
            title="No price records found"
            message={
              prices.length === 0
                ? "Add crop-price records to your database to display them here."
                : "Try another crop or market name."
            }
          />
        ) : (
          <section className="workspace-panel">
            <div className="workspace-table-wrapper">
              <table className="workspace-table">
                <thead>
                  <tr>
                    <th>Crop</th>
                    <th>Variety</th>
                    <th>Market</th>
                    <th>Date</th>
                    <th>Minimum</th>
                    <th>Maximum</th>
                    <th>Modal price</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPrices.map((item) => (
                    <tr key={item.id}>
                      <td>{item.cropName || "—"}</td>
                      <td>{item.variety || "—"}</td>
                      <td>
                        {[item.marketName, item.district]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </td>
                      <td>{item.priceDate || "—"}</td>
                      <td>{formatPrice(item.minPrice)}</td>
                      <td>{formatPrice(item.maxPrice)}</td>
                      <td>
                        <strong>{formatPrice(item.modalPrice)}</strong>
                        <br />
                        <small>{item.priceUnit || "Unit not specified"}</small>
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