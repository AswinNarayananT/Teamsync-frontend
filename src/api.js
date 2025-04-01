import axios from "axios";

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
          throw new Error("No refresh token available");
        }

        const refreshResponse = await api.post('api/v1/token/refresh/', { refresh: refreshToken });

        if (refreshResponse.status === 200) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("refresh_token"); 
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;


