import axios from "axios";

export const server = import.meta.env.VITE_API_URL;

let csrfToken = "";

export const setCsrfToken = (token) => {
  console.log("Token stored in interceptor:", token)

  csrfToken = token
}

export const api = axios.create({
  baseURL: server,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  if (csrfToken) {
    config.headers["x-csrf-token"] = csrfToken;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("api/v1/refresh");
        const { data } = await api.get("/api/v1/csrfToken");
        setCsrfToken(data.csrfToken);
        processQueue(null, null);
        return api(originalRequest);
      } catch (error) {
        processQueue(error, null);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
