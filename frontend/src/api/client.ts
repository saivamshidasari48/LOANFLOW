// client.ts
import axios from "axios";

/**
 * Centralized Axios client configuration.
 *
 * This instance is reused across the application to ensure:
 *  - Consistent base API URL
 *  - Automatic attachment of authentication headers
 */
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080";

const client = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Request interceptor that automatically injects the JWT token
 * into the Authorization header for authenticated API calls.
 */
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Stored after login

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;
