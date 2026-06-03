import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  // Debug: log when a token is attached so we can confirm header usage in Network
  if (token && config.headers) {
    // eslint-disable-next-line no-console
    console.debug("api: attaching auth token, len=", token.length);
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // eslint-disable-next-line no-console
    console.debug("api: no auth token to attach");
  }
  return config;
});

// Log responses/errors for easier debugging during development
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // eslint-disable-next-line no-console
    console.error("api: response error", err?.response?.status, err?.response?.data);
    return Promise.reject(err);
  }
);

export const authEndpoints = {
  login: "/auth/login",
  register: "/auth/register",
};

export const productEndpoints = {
  list: "/products",
  create: "/products",
  update: (id: number) => `/products/${id}`,
  delete: (id: number) => `/products/${id}`,
};

export const customerEndpoints = {
  list: "/customers",
  create: "/customers",
  update: (id: number) => `/customers/${id}`,
  delete: (id: number) => `/customers/${id}`,
};

export const orderEndpoints = {
  list: "/orders",
  create: "/orders",
  detail: (id: number) => `/orders/${id}`,
};

export const dashboardEndpoints = {
  stats: "/dashboard/stats",
};
