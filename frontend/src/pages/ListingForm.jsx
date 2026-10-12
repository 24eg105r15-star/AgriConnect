
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { apiRequest } from "../services/api";
import AppHeader from "../components/AppHeader";
import "./Workspace.css";

const initialForm = {
  cropName: "",
  variety: "",
  availableQuantityQuintals: "",
  minimumOrderQuintals: "",
  askingPricePerQuintal: "",
  qualityGrade: "",
  description: "",
  imageUrl: "",
  harvestDate: "",
  availableFrom: "",
  pickupDistrict: "",
  pickupState: "",
  transportArrangement: "BUYER_ARRANGES",
};

function dateValue(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export default function ListingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      setForm(initialForm);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function loadListing() {
      setLoading(true);
      setError("");

      try {
        const listing = await apiRequest(`/api/listings/${id}`);

        if (cancelled) return;

        setForm({
          cropName:
            listing.cropName ?? listing.crop?.name ?? "",
          variety: listing.variety ?? "",
          availableQuantityQuintals:
            listing.availableQuantityQuintals ??
            listing.quantityQuintals ??
            "",
          minimumOrderQuintals:
            listing.minimumOrderQuintals ?? "",
          askingPricePerQuintal:
            listing.askingPricePerQuintal ??
            listing.pricePerQuintal ??
            "",
          qualityGrade: listing.qualityGrade ?? "",
          description: listing.description ?? "",
          imageUrl: listing.imageUrl ?? "",
          harvestDate: dateValue(listing.harvestDate),
          availableFrom: dateValue(listing.availableFrom),
          pickupDistrict: listing.pickupDistrict ?? "",
          pickupState: listing.pickupState ?? "",
          transportArrangement:
            listing.transportArrangement ?? "BUYER_ARRANGES",
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message || "Unable to load this crop listing."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadListing();

    return () => {
      cancelled = true;
    };
  }, [id, isEditing]);

  function changeField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const cropName = form.cropName.trim();
    const quantity = Number(form.availableQuantityQuintals);
    const minimum = Number(form.minimumOrderQuintals);
    const price = Number(form.askingPricePerQuintal);

    if (!cropName) {
      setError("Please enter the crop name.");
      return;
    }

    if (
      !Number.isFinite(quantity) ||
      !Number.isFinite(minimum) ||
      !Number.isFinite(price) ||
      quantity <= 0 ||
      minimum <= 0 ||
      price <= 0
    ) {
      setError("Enter valid positive quantities and price.");
      return;
    }

    if (minimum > quantity) {
      setError("Minimum order cannot exceed available quantity.");
      return;
    }

    if (
      !form.variety.trim() ||
      !form.qualityGrade.trim() ||
      !form.availableFrom ||
      !form.pickupDistrict.trim() ||
      !form.pickupState.trim() ||
      !form.transportArrangement.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const payload = {
      cropName,
      variety: form.variety.trim(),
      availableQuantityQuintals: quantity,
      minimumOrderQuintals: minimum,
      askingPricePerQuintal: price,
      qualityGrade: form.qualityGrade.trim(),
      description: form.description.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      harvestDate: form.harvestDate || null,
      availableFrom: form.availableFrom,
      pickupDistrict: form.pickupDistrict.trim(),
      pickupState: form.pickupState.trim(),
      transportArrangement: form.transportArrangement.trim(),
    };

    setSaving(true);

    try {
      if (isEditing) {
        await apiRequest(`/api/listings/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/api/listings", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      navigate("/farmer", {
        replace: true,
        state: {
          notice: isEditing
            ? "Your crop listing was updated."
            : "Your crop listing was created.",
        },
      });
    } catch (err) {
      setError(
        err.message ||
          (isEditing
            ? "Unable to update the listing."
            : "Unable to create the listing.")
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="workspace-page">
        <AppHeader />
        <main className="workspace-main">
          <p>Loading crop listing...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="workspace-page">
      <AppHeader />

      <main className="workspace-main">
        <div className="workspace-title">
          <span className="workspace-eyebrow">
            FARMER WORKSPACE
          </span>
          <h1>
            {isEditing ? "Edit crop listing" : "Create a crop listing"}
          </h1>
          <p>
            {isEditing
              ? "Update your crop details, quantity, price, and pickup information."
              : "Enter any crop name, the available quantity, asking price, and pickup location you want buyers to see."}
          </p>
        </div>

        <section className="workspace-panel">
          <form className="workspace-form" onSubmit={handleSubmit}>
            <div className="workspace-field">
              <label htmlFor="cropName">Crop name *</label>
              <input
                id="cropName"
                name="cropName"
                value={form.cropName}
                onChange={changeField}
                placeholder="e.g. Rice, Dragon Fruit, Millets, Saffron"
                maxLength={120}
                required
              />
            </div>

            <div className="workspace-field">
              <label htmlFor="variety">Variety *</label>
              <input
                id="variety"
                name="variety"
                value={form.variety}
                onChange={changeField}
                placeholder="e.g. Basmati"
                maxLength={120}
                required
              />
            </div>

            <div className="workspace-field">
              <label htmlFor="availableQuantityQuintals">
                Available quantity (quintals) *
              </label>
              <input
                id="availableQuantityQuintals"
                name="availableQuantityQuintals"
                type="number"
                min="0.01"
                step="0.01"
                value={form.availableQuantityQuintals}
                onChange={changeField}
                required
              />
            </div>

            <div className="workspace-field">
              <label htmlFor="minimumOrderQuintals">
                Minimum order (quintals) *
              </label>
              <input
                id="minimumOrderQuintals"
                name="minimumOrderQuintals"
                type="number"
                min="0.01"
                step="0.01"
                value={form.minimumOrderQuintals}
                onChange={changeField}
                required
              />
            </div>

            <div className="workspace-field">
              <label htmlFor="askingPricePerQuintal">
                Asking price (₹ per quintal) *
              </label>
              <input
                id="askingPricePerQuintal"
                name="askingPricePerQuintal"
                type="number"
                min="0.01"
                step="0.01"
                value={form.askingPricePerQuintal}
                onChange={changeField}
                required
              />
            </div>

            <div className="workspace-field">
              <label htmlFor="qualityGrade">Quality grade *</label>
              <input
                id="qualityGrade"
                name="qualityGrade"
                value={form.qualityGrade}
                onChange={changeField}
                placeholder="e.g. Grade A"
                maxLength={50}
                required
              />
            </div>

            <div className="workspace-field">
              <label htmlFor="harvestDate">Harvest date</label>
              <input
                id="harvestDate"
                name="harvestDate"
                type="date"
                value={form.harvestDate}
                onChange={changeField}
              />
            </div>

            <div className="workspace-field">
              <label htmlFor="availableFrom">Available from *</label>
              <input
                id="availableFrom"
                name="availableFrom"
                type="date"
                value={form.availableFrom}
                onChange={changeField}
                required
              />
            </div>

            <div className="workspace-field">
              <label htmlFor="pickupDistrict">Pickup district *</label>
              <input
                id="pickupDistrict"
                name="pickupDistrict"
                value={form.pickupDistrict}
                onChange={changeField}
                maxLength={100}
                required
              />
            </div>

            <div className="workspace-field">
              <label htmlFor="pickupState">Pickup state *</label>
              <input
                id="pickupState"
                name="pickupState"
                value={form.pickupState}
                onChange={changeField}
                maxLength={100}
                required
              />
            </div>

            <div className="workspace-field workspace-field-full">
              <label htmlFor="transportArrangement">
                Transport arrangement *
              </label>
              <select
                id="transportArrangement"
                name="transportArrangement"
                value={form.transportArrangement}
                onChange={changeField}
                required
              >
                <option value="BUYER_ARRANGES">
                  Buyer arranges transport
                </option>
                <option value="FARMER_ARRANGES">
                  Farmer arranges transport
                </option>
                <option value="NEGOTIABLE">
                  Transport negotiable
                </option>
              </select>
            </div>

            <div className="workspace-field workspace-field-full">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={changeField}
                placeholder="https://example.com/crop.jpg"
              />
            </div>

            <div className="workspace-field workspace-field-full">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={changeField}
                placeholder="Describe the crop, quality, and other useful details."
              />
            </div>

            {error && (
              <div
                className="workspace-error workspace-field-full"
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="workspace-field workspace-field-full">
              <button
                type="submit"
                className="workspace-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : isEditing
                    ? "Save Changes"
                    : "Publish Listing"}
              </button>

              <button
                type="button"
                className="workspace-button"
                disabled={saving}
                onClick={() => navigate("/farmer")}
                style={{ marginTop: "10px" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
