import axios from "axios";
import { getAccessToken } from "./auth";

const httpClient = axios.create({
  baseURL: "https://bluematrouh-backend.onrender.com/api",
  withCredentials: true,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (err) => Promise.reject(err),
);

export default httpClient;
