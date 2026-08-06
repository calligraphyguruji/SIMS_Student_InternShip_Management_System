import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  withCredentials: true,
});

// Attach the JWT stored at login to every request as a fallback to the cookie
api.interceptors.request.use((config) => {
  const requestUrl = config.url || "";
  const isLoginRequest = requestUrl.includes("/auth/login");
  const isRegisterRequest = requestUrl.includes("/auth/register");

  if (isLoginRequest || isRegisterRequest) {
    delete config.headers.Authorization;
    return config;
  }

  const token = localStorage.getItem("sims_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, clear local state and bounce to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isLoginRequest = requestUrl.includes("/auth/login");
    const isRegisterRequest = requestUrl.includes("/auth/register");

    if (error.response?.status === 401 && !isLoginRequest && !isRegisterRequest) {
      localStorage.removeItem("sims_token");
      localStorage.removeItem("sims_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
