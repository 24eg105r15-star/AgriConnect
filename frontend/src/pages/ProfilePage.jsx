import { useEffect, useState } from "react";

import { apiRequest } from "../services/api";
import { useAuth } from "../context/AuthContext";
import AppHeader from "../components/AppHeader";
import { LoadingState } from "../components/PageState";
import "./Workspace.css";

const farmerFields = [
  { name: "phoneNumber", label: "Phone number" },
  { name: "farmName", label: "Farm name" },
  { name: "village", label: "Village" },
  { name: "district", label: "District", required: true },
  { name: "state", label: "State", required: true },
  { name: "postalCode", label: "Postal code" },
];

const buyerFields = [
  { name: "businessName", label: "Business name", required: true },
  { name: "buyerType", label: "Buyer type" },
  { name: "phoneNumber", label: "Phone number" },
  { name: "gstNumber", label: "GST number" },
  { name: "city", label: "City" },
  { name: "district", label: "District", required: true },
  { name: "state", label: "State", required: true },
  { name: "postalCode", label: "Postal code" },
];

export default function ProfilePage() {
  const { user } = useAuth();

  const role = user?.role;
  const isFarmer = role === "FARMER";
  const endpoint = isFarmer
    ? "/api/farmer/profile"
    : "/api/buyer/profile";

  const fields = isFarmer ? farmerFields : buyerFields;

  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setError("");
      setNotice("");

      try {
        const data = await apiRequest(endpoint);

        if (!cancelled) {
          const values = {};
          fields.forEach((field) => {
            values[field.name] = data[field.name] ?? "";
          });
          setForm(values);
        }
      } catch (err) {
        if (!cancelled) {
          // Keep the form usable when a profile has not been created yet.
          setForm(
            Object.fromEntries(fields.map((field) => [field.name, ""]))
          );
          setNotice(
            "No saved profile was loaded. Complete the form and save it."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [endpoint, isFarmer]);

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
    setNotice("");
    setSaving(true);

    const payload = Object.fromEntries(
      fields.map((field) => [
        field.name,
        String(form[field.name] ?? "").trim() || null,
      ])
    );

    try {
      await apiRequest(endpoint, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setNotice("Your profile was saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (!isFarmer && role !== "BUYER") {
    return (
      <div className="workspace-page">
        <AppHeader />
        <main className="workspace-main">
          <div className="workspace-error">
            This profile form is available to farmer and buyer accounts.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="workspace-page">
      <AppHeader />

      <main className="workspace-main">
        <div className="workspace-title">
          <span className="workspace-eyebrow">ACCOUNT SETTINGS</span>
          <h1>{isFarmer ? "Farmer profile" : "Buyer profile"}</h1>
          <p>
            Keep your contact and location details up to date for marketplace
            activities.
          </p>
        </div>

        {loading ? (
          <LoadingState message="Loading profile..." />
        ) : (
          <section className="workspace-panel">
            {notice && (
              <p className="workspace-notice">{notice}</p>
            )}

            {error && (
              <p className="workspace-error" role="alert">
                {error}
              </p>
            )}

            <form className="workspace-form" onSubmit={handleSubmit}>
              {fields.map((field) => (
                <div className="workspace-field" key={field.name}>
                  <label htmlFor={field.name}>{field.label}</label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={form[field.name] ?? ""}
                    onChange={changeField}
                    required={Boolean(field.required)}
                  />
                </div>
              ))}

              <div className="workspace-field workspace-field-full">
                <button
                  className="workspace-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving profile..." : "Save profile"}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
}