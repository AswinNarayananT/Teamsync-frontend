import axios from "axios";
import { store } from "./redux/store";
import { logoutUser } from "./redux/auth/authThunks";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          console.log("NO REFRESH")
          store.dispatch(logoutUser())
          return Promise.reject(new Error("No refresh token available"));
        }

        const refreshResponse = await api.post('api/v1/token/refresh/', { refresh: refreshToken });

        if (refreshResponse.status === 200) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("refresh_token"); 
        store.dispatch(logoutUser())
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;


