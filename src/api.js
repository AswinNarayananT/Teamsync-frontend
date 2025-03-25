import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Ensures cookies are sent
});

// Flag to prevent multiple refresh requests at the same time
// let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // if (isRefreshing) return Promise.reject(error);
      console.log("refreshing the token")
      // isRefreshing = true;
      originalRequest._retry = true;
      try {
        const refreshResponse = await api.post('api/v1/token/refresh/', {}, { withCredentials: true });
        // isRefreshing = false;
        if (refreshResponse.status === 200) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        // isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default api;
