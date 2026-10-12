import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { apiRequest } from "../services/api";
import AppHeader from "../components/AppHeader";
import {
  ErrorState,
  LoadingState,
} from "../components/PageState";
import "./Workspace.css";

export default function PlaceOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadListing() {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest(`/api/listings/${id}`);

        if (!cancelled) {
          setListing(data);
          setPrice(
            data.askingPricePerQuintal == null
              ? ""
              : String(data.askingPricePerQuintal)
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load this listing.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadListing();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const requestedQuantity = Number(quantity);
    const offeredPrice = Number(price);

    if (requestedQuantity <= 0 || offeredPrice <= 0) {
      setError("Enter a valid quantity and positive offer price.");
      return;
    }

    if (
      requestedQuantity <
        Number(listing?.minimumOrderQuintals || 0) ||
      requestedQuantity >
        Number(listing?.availableQuantityQuintals || 0)
    ) {
      setError(
        "The requested quantity must be within the listing's minimum and available quantities."
      );
      return;
    }

    setSaving(true);

    try {
      await apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          listingId: Number(id),
          quantityRequestedQuintals: requestedQuantity,
          offeredPricePerQuintal: offeredPrice,
          buyerMessage: message.trim() || null,
        }),
      });

      navigate("/orders", {
        replace: true,
        state: { notice: "Your order request was submitted." },
      });
    } catch (err) {
      setError(err.message || "Unable to submit your order.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="workspace-page">
      <AppHeader />

      <main className="workspace-main">
        <div className="workspace-title">
          <span className="workspace-eyebrow">BUYER WORKSPACE</span>
          <h1>Place an order</h1>
          <p>Review the crop details and send your purchase request.</p>
        </div>

        {loading ? (
          <LoadingState message="Loading listing details..." />
        ) : error && !listing ? (
          <ErrorState message={error} />
        ) : listing ? (
          <section className="workspace-panel">
            <h2>{listing.cropName || "Crop listing"}</h2>

            <p>
              Farmer: {listing.farmerName || "—"}
            </p>

            <p>
              Location:{" "}
              {[listing.pickupDistrict, listing.pickupState]
                .filter(Boolean)
                .join(", ") || "—"}
            </p>

            <p>
              Available quantity: {listing.availableQuantityQuintals} quintals
            </p>

            <p>
              Minimum order: {listing.minimumOrderQuintals} quintals
            </p>

            <p>
              Asking price: ₹
              {Number(listing.askingPricePerQuintal).toLocaleString("en-IN")}
              {" "}per quintal
            </p>

            <form
              className="workspace-form"
              onSubmit={handleSubmit}
              style={{ marginTop: 24 }}
            >
              <div className="workspace-field">
                <label htmlFor="order-quantity">
                  Quantity (quintals) *
                </label>
                <input
                  id="order-quantity"
                  type="number"
                  min={listing.minimumOrderQuintals}
                  max={listing.availableQuantityQuintals}
                  step="0.01"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  required
                />
              </div>

              <div className="workspace-field">
                <label htmlFor="order-price">
                  Your offer (₹ per quintal) *
                </label>
                <input
                  id="order-price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  required
                />
              </div>

              <div className="workspace-field workspace-field-full">
                <label htmlFor="order-message">
                  Message to farmer
                </label>
                <textarea
                  id="order-message"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Add delivery or purchase requirements."
                />
              </div>

              {error && (
                <div className="workspace-error workspace-field-full">
                  {error}
                </div>
              )}

              <div className="workspace-field workspace-field-full">
                <button
                  className="workspace-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Submitting order..." : "Submit order request"}
                </button>

                <Link className="text-link" to="/marketplace">
                  Cancel and return to marketplace
                </Link>
              </div>
            </form>
          </section>
        ) : null}
      </main>
    </div>
  );
}