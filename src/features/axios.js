import axios from "axios";

const api = axios.create({
  baseURL: "https://yotube-backend-2.onrender.com/api/v1",
  withCredentials: true,
  timeout: 15000,
});


api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/users/refresh_token");
        return api(originalRequest)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error);
  }
)

export { api };