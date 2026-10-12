
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sprout,
  Search,
  MapPin,
  RefreshCw,
  ShoppingBasket,
  AlertCircle,
} from "lucide-react";
import { apiRequest } from "../services/api";

function getCropName(item) {
  return (
    item.cropName ??
    item.crop?.name ??
    item.crop?.cropName ??
    item.name ??
    "Crop"
  );
}

function getQuantity(item) {
  return (
    item.quantityQuintals ??
    item.availableQuantityQuintals ??
    item.quantity ??
    null
  );
}

function getPrice(item) {
  return (
    item.pricePerQuintal ??
    item.askingPricePerQuintal ??
    item.expectedPricePerQuintal ??
    item.price ??
    null
  );
}

function getLocation(item) {
  return (
    item.location ??
    item.farmerLocation ??
    item.farmer?.location ??
    "Location not provided"
  );
}

function formatPrice(value) {
  if (value == null || value === "") return "Price not specified";

  const number = Number(value);

  return Number.isFinite(number)
    ? `₹${number.toLocaleString("en-IN")} / quintal`
    : String(value);
}

export default function Marketplace() {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
const [orderQuantity, setOrderQuantity] = useState("");
const [offerPrice, setOfferPrice] = useState("");
const [buyerMessage, setBuyerMessage] = useState("");
const [submittingOrder, setSubmittingOrder] = useState(false);
const [orderError, setOrderError] = useState("");
const [orderSuccess, setOrderSuccess] = useState("");

  const loadListings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest("/api/listings");

      const items = Array.isArray(response)
        ? response
        : response?.content ??
          response?.items ??
          response?.listings ??
          [];

      if (!Array.isArray(items)) {
        throw new Error("The listings API returned an unexpected response.");
      }

      setListings(items);
    } catch (err) {
      setError(err.message || "Unable to load marketplace listings.");
    } finally {
      setLoading(false);
    }
  }, []);

const openOrderForm = (listing) => {
  setSelectedListing(listing);
  setOrderQuantity("");
  setOfferPrice(String(getPrice(listing) ?? ""));
  setBuyerMessage("");
  setOrderError("");
  setOrderSuccess("");
};

const closeOrderForm = () => {
  if (submittingOrder) return;

  setSelectedListing(null);
  setOrderError("");
};

const submitOrder = async (event) => {
  event.preventDefault();

  if (!selectedListing) return;

  const listingId = selectedListing.id ?? selectedListing.listingId;
  const quantity = Number(orderQuantity);
  const price = Number(offerPrice);
  const availableQuantity = Number(getQuantity(selectedListing));
  const minimumQuantity = Number(
    selectedListing.minimumOrderQuintals ?? 0.01
  );

  if (listingId == null) {
    setOrderError("This listing has no valid ID. Refresh the marketplace.");
    return;
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    setOrderError("Enter a quantity greater than zero.");
    return;
  }

  if (
    Number.isFinite(availableQuantity) &&
    availableQuantity > 0 &&
    quantity > availableQuantity
  ) {
    setOrderError(`Only ${availableQuantity} quintals are available.`);
    return;
  }

  if (quantity < minimumQuantity) {
    setOrderError(
      `The minimum order quantity is ${minimumQuantity} quintals.`
    );
    return;
  }

  if (!Number.isFinite(price) || price <= 0) {
    setOrderError("Enter an offer price greater than zero.");
    return;
  }

  setSubmittingOrder(true);
  setOrderError("");
  setOrderSuccess("");

  try {
    await apiRequest("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listingId: Number(listingId),
        quantityRequestedQuintals: quantity,
        offeredPricePerQuintal: price,
        buyerMessage: buyerMessage.trim(),
      }),
    });

    setOrderSuccess(
      `Your order for ${getCropName(selectedListing)} was submitted successfully.`
    );

    setSelectedListing(null);
    setOrderQuantity("");
    setOfferPrice("");
    setBuyerMessage("");
  } catch (err) {
    setOrderError(
      err.message || "Unable to place your order. Please try again."
    );
  } finally {
    setSubmittingOrder(false);
  }
};

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const locations = useMemo(() => {
    return [
      ...new Set(
        listings
          .map(getLocation)
          .filter((location) => location !== "Location not provided")
      ),
    ].sort();
  }, [listings]);

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase();

    return listings.filter((item) => {
      const searchableText = [
        getCropName(item),
        getLocation(item),
        item.description,
        item.farmerName,
        item.farmer?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const matchesLocation =
        !locationFilter || getLocation(item) === locationFilter;

      const status = String(item.status ?? "AVAILABLE").toUpperCase();
      const isAvailable = ["AVAILABLE", "ACTIVE", "OPEN"].includes(status);

      return matchesSearch && matchesLocation && isAvailable;
    });
  }, [listings, search, locationFilter]);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate("/")} style={styles.brand}>
          <Sprout size={29} />
          AgriConnect
        </button>

        <button onClick={() => navigate(-1)} style={styles.backButton}>
          Back
        </button>
      </header>

      <section style={styles.content}>
        <div style={styles.hero}>
          <span style={styles.eyebrow}>FARM TO MARKET</span>
          <h1>Explore the Crop Marketplace</h1>
          <p>
            Discover crops offered by farmers and compare their prices
            before making a purchase decision.
          </p>
        </div>
             
{selectedListing && (
  <div style={styles.modalOverlay}>
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="orderFormTitle"
      style={styles.orderModal}
    >
      <div style={styles.modalHeader}>
        <div>
          <span style={styles.eyebrow}>
            BUY DIRECT FROM FARMERS
          </span>
          <h2 id="orderFormTitle">Place Your Order</h2>
          <p>{getCropName(selectedListing)}</p>
        </div>

        <button
          type="button"
          onClick={closeOrderForm}
          disabled={submittingOrder}
          style={styles.closeButton}
          aria-label="Close order form"
        >
          ✕
        </button>
      </div>

      <div style={styles.orderInfo}>
        <p>
          <strong>Available:</strong>{" "}
          {getQuantity(selectedListing) ?? "Not specified"} quintals
        </p>
        <p>
          <strong>Farmer's asking price:</strong>{" "}
          {formatPrice(getPrice(selectedListing))}
        </p>
      </div>

      {orderError && (
        <div role="alert" style={styles.orderError}>
          {orderError}
        </div>
      )}

      <form onSubmit={submitOrder}>
        <label style={styles.fieldLabel}>
          Quantity (quintals) *
          <input
            type="number"
            min={selectedListing.minimumOrderQuintals ?? "0.01"}
            max={getQuantity(selectedListing) ?? undefined}
            step="0.01"
            required
            value={orderQuantity}
            onChange={(e) => setOrderQuantity(e.target.value)}
            placeholder="Enter required quantity"
            style={styles.formInput}
          />
        </label>

        <label style={styles.fieldLabel}>
          Your offer price per quintal (₹) *
          <input
            type="number"
            min="0.01"
            step="0.01"
            required
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            placeholder="Enter your price offer"
            style={styles.formInput}
          />
        </label>

        <label style={styles.fieldLabel}>
          Message to farmer (optional)
          <textarea
            maxLength={1000}
            rows={4}
            value={buyerMessage}
            onChange={(e) => setBuyerMessage(e.target.value)}
            placeholder="Add delivery requirements or other details"
            style={styles.formInput}
          />
          <span style={styles.characterCount}>
            {buyerMessage.length}/1000 characters
          </span>
        </label>

        {Number(orderQuantity) > 0 && Number(offerPrice) > 0 && (
          <div style={styles.orderTotal}>
            <span>Estimated order value</span>
            <strong>
              {formatPrice(
                Number(orderQuantity) * Number(offerPrice)
              ).replace(" / quintal", "")}
            </strong>
            <small>
              Quantity × your offer price; final price may change during
              negotiation.
            </small>
          </div>
        )}

        <div style={styles.modalActions}>
          <button
            type="button"
            onClick={closeOrderForm}
            disabled={submittingOrder}
            style={styles.cancelButton}
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submittingOrder}
            style={styles.placeOrderButton}
          >
            {submittingOrder ? "Submitting..." : "Submit Order"}
          </button>
        </div>
      </form>
    </section>
  </div>
)}

        <section style={styles.searchPanel}>
          <div style={styles.searchBox}>
            <Search size={20} color="#64748b" />

            <input
              type="search"
              placeholder="Search crops, farmers, or locations..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search crops"
              style={styles.input}
            />
          </div>

          <select
            value={locationFilter}
            onChange={(event) => setLocationFilter(event.target.value)}
            aria-label="Filter by location"
            style={styles.select}
          >
            <option value="">All locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <button
            onClick={loadListings}
            disabled={loading}
            style={styles.refreshButton}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </section>

        <div style={styles.resultsHeader}>
          <div>
            <h2>Available Crops</h2>
            <p>
              {loading
                ? "Loading listings..."
                : `${filteredListings.length} listing(s) found`}
            </p>
          </div>
        </div>

        {loading && (
          <div style={styles.message}>
            Loading available crops from AgriConnect...
          </div>
        )}

        {!loading && error && (
          <div role="alert" style={styles.error}>
            <AlertCircle size={22} />
            <div>
              <strong>Unable to load crops</strong>
              <p>{error}</p>
              <button onClick={loadListings} style={styles.retryButton}>
                Try again
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filteredListings.length === 0 && (
          <div style={styles.empty}>
            <ShoppingBasket size={42} />
            <h3>No matching crops found</h3>
            <p>
              Try another search or location, or check back when
              farmers add new listings.
            </p>

            {(search || locationFilter) && (
              <button
                onClick={() => {
                  setSearch("");
                  setLocationFilter("");
                }}
                style={styles.clearButton}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && filteredListings.length > 0 && (
          <div style={styles.grid}>
            {filteredListings.map((item, index) => {
              const id = item.id ?? item.listingId ?? index;
              const quantity = getQuantity(item);
              const price = getPrice(item);

              return (
                <article key={id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <div style={styles.cropIcon}>
                      <Sprout size={29} />
                    </div>

                    <span style={styles.availableBadge}>
                      Available
                    </span>
                  </div>

                  <h3 style={styles.cropName}>{getCropName(item)}</h3>

                  <p style={styles.farmer}>
                    Farmer:{" "}
                    {item.farmerName ??
                      item.farmer?.name ??
                      "AgriConnect farmer"}
                  </p>

                  <p style={styles.location}>
                    <MapPin size={16} />
                    {getLocation(item)}
                  </p>

                  <div style={styles.details}>
                    <div>
                      <span style={styles.detailLabel}>Quantity</span>
                      <strong>
                        {quantity == null
                          ? "Not specified"
                          : `${quantity} quintals`}
                      </strong>
                    </div>

                    <div>
                      <span style={styles.detailLabel}>Price</span>
                      <strong style={styles.price}>
                        {formatPrice(price)}
                      </strong>
                    </div>
                  </div>

                  {item.description && (
                    <p style={styles.description}>{item.description}</p>
                  )}

                  
<div style={styles.cardFooter}>
  <button
    type="button"
    onClick={() => navigate("/prices")}
    style={styles.secondaryButton}
  >
    Compare prices
  </button>

  <button
    type="button"
    onClick={() => openOrderForm(item)}
    style={styles.placeOrderButton}
  >
    <ShoppingBasket size={17} />
    Place Order
  </button>
</div>

                </article>
              );
            })}
          </div>
        )}
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
    minHeight: "75px",
    padding: "14px 5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#15803d",
    fontSize: "23px",
    fontWeight: 700,
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  backButton: {
    padding: "10px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "#fff",
    cursor: "pointer",
  },
  content: {
    width: "min(1150px, 92%)",
    margin: "0 auto",
    padding: "38px 0",
    boxSizing: "border-box",
  },
  hero: {
    padding: "20px 0 28px",
  },
  eyebrow: {
    color: "#15803d",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "1.7px",
  },
  searchPanel: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    padding: "16px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
  },
  searchBox: {
    flex: "1 1 300px",
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 12px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
  },
  input: {
    width: "100%",
    minWidth: 0,
    padding: "13px 0",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "transparent",
  },
  select: {
    flex: "1 1 160px",
    padding: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    background: "#fff",
    minWidth: 0,
  },
  refreshButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    padding: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    background: "#fff",
    cursor: "pointer",
  },
  resultsHeader: {
    margin: "30px 0 18px",
  },
  message: {
    padding: "35px 10px",
    textAlign: "center",
    color: "#64748b",
  },
  error: {
    display: "flex",
    gap: "12px",
    padding: "20px",
    borderRadius: "12px",
    background: "#fef2f2",
    color: "#b91c1c",
    overflowWrap: "anywhere",
  },
  retryButton: {
    padding: "9px 13px",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    background: "#fff",
    color: "#991b1b",
    cursor: "pointer",
  },
  empty: {
    padding: "55px 18px",
    border: "1px dashed #cbd5e1",
    borderRadius: "14px",
    background: "#fff",
    textAlign: "center",
    color: "#64748b",
  },
  clearButton: {
    padding: "10px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#15803d",
    color: "#fff",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },
  card: {
    minWidth: 0,
    padding: "21px",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    background: "#fff",
    boxShadow: "0 4px 15px rgba(15, 23, 42, 0.03)",
    overflowWrap: "anywhere",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  cropIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "13px",
    background: "#dcfce7",
    color: "#15803d",
    display: "grid",
    placeItems: "center",
  },
  availableBadge: {
    padding: "6px 9px",
    color: "#166534",
    background: "#f0fdf4",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 600,
  },
  cropName: {
    margin: "18px 0 7px",
    fontSize: "21px",
  },
  farmer: {
    color: "#64748b",
    fontSize: "13px",
  },
  location: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#64748b",
    fontSize: "13px",
  },
  details: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "13px",
    borderTop: "1px solid #e5e7eb",
    marginTop: "18px",
    paddingTop: "16px",
  },
  detailLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
    marginBottom: "5px",
  },
  price: {
    color: "#15803d",
  },
  description: {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.6,
  },
  
cardFooter: {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginTop: "16px",
  paddingTop: "16px",
  borderTop: "1px solid #e5e7eb",
},

  secondaryButton: {
    width: "100%",
    padding: "11px",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    background: "#f0fdf4",
    color: "#166534",
    fontWeight: 600,
    cursor: "pointer",
  },
  
successMessage: {
  marginBottom: "20px",
  padding: "18px",
  border: "1px solid #86efac",
  borderRadius: "12px",
  background: "#f0fdf4",
  color: "#166534",
},

placeOrderButton: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  background: "#15803d",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
},

modalOverlay: {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "16px",
  background: "rgba(15, 23, 42, 0.6)",
  overflowY: "auto",
},

orderModal: {
  width: "min(520px, 100%)",
  maxHeight: "90vh",
  overflowY: "auto",
  boxSizing: "border-box",
  padding: "24px",
  borderRadius: "16px",
  background: "#fff",
  color: "#183b24",
  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
},

modalHeader: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "18px",
},

closeButton: {
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  background: "#fff",
  padding: "8px 11px",
  cursor: "pointer",
},

orderInfo: {
  padding: "12px 16px",
  marginBottom: "18px",
  borderRadius: "10px",
  background: "#f0fdf4",
  fontSize: "14px",
},

orderError: {
  padding: "12px",
  marginBottom: "16px",
  borderRadius: "8px",
  background: "#fef2f2",
  color: "#b91c1c",
  overflowWrap: "anywhere",
},

fieldLabel: {
  display: "block",
  marginBottom: "16px",
  fontSize: "14px",
  fontWeight: 600,
},

formInput: {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: "7px",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  font: "inherit",
  background: "#fff",
},

characterCount: {
  display: "block",
  marginTop: "5px",
  textAlign: "right",
  color: "#64748b",
  fontSize: "12px",
},

orderTotal: {
  display: "grid",
  gap: "7px",
  padding: "14px",
  marginBottom: "18px",
  border: "1px solid #bbf7d0",
  borderRadius: "10px",
  background: "#f0fdf4",
},

modalActions: {
  display: "flex",
  gap: "12px",
  marginTop: "20px",
},

cancelButton: {
  flex: 1,
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  background: "#fff",
  cursor: "pointer",
},
};
