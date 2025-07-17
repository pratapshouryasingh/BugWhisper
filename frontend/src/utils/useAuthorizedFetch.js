import { useAuth } from "@clerk/clerk-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

/**
 * Hook to make authenticated API calls with Clerk + auto JSON handling.
 */
export const useAuthorizedFetch = () => {
  const { getToken } = useAuth();

  return async (endpoint, options = {}) => {
    const token = await getToken().catch(() => null);
    if (!token) {
      throw new Error("❌ No Clerk token available");
    }

    const isFormData = options.body instanceof FormData;

    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`, // ✅ Correct template literal
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
    };

    let body = options.body;
    if (!isFormData && body && typeof body === "object") {
      body = JSON.stringify(body);
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: options.method || "GET",
      headers,
      body,
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "Unknown error");
      throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return res;
  };
};
