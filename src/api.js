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

        if (!refreshToken || isTokenExpired(refreshToken)) {
          console.log("refresh token expired")
          localStorage.removeItem("refresh_token");
          store.dispatch(logoutUser());
          return Promise.reject(new Error("Refresh token expired or missing"));
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


function isTokenExpired(token) {
  if (!token) return true;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (err) {
    console.error("Failed to decode token", err);
    return true; 
  }
}
