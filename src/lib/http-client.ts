import axios from "axios";

const httpClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
  withCredentials: true,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (err) => Promise.reject(err),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("logout"));
    }

    return Promise.reject(error);
  },
);

export default httpClient;
