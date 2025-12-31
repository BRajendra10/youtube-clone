import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URI,
  withCredentials: true,
  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/users/refresh_token")) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/users/refresh_token");
        return api(originalRequest)
      } catch (refreshError) {
        console.log("refresh failed now login")
        
        window.location.href = "/login";
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error);
  }
)

export { api };