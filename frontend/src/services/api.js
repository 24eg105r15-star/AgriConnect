
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://agriconnect-backend-1-q7ke.onrender.com";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("agriToken");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data.message || data.error || `Request failed (${response.status})`;

    throw new Error(message);
  }

  return data;
}
