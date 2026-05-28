const BASE_URL = "https://localhost:7236/api";

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
});

const api = {
  get: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  post: async (endpoint, body) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST", headers: getHeaders(), body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  put: async (endpoint, body) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT", headers: getHeaders(), body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error(await res.text());
    if (res.status === 204) return null;
    return res.json();
  },
  delete: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE", headers: getHeaders()
    });
    if (res.status === 204) return null;
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }
};

export default api;
