import axios from "axios";

const baseUrl = import.meta.env.VITE_BACKEND_URL;
export const customFetch = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // allow to pass with cookies
});
