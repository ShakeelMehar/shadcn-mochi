import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://72.60.234.139/api",
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("mochi_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("mochi_token");
      document.cookie = "mochi_token=; Max-Age=0; path=/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
