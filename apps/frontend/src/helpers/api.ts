import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import { getEnvsUrl } from "./envs";

export const api: AxiosInstance = axios.create({
  baseURL: getEnvsUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

export const apiSimulation: AxiosInstance = axios.create({
  baseURL: getEnvsUrl('VITE_SIMULATION_URL'),
  headers: {
    "Content-Type": "application/json",
  },
});
