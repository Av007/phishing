import { getEnvsUrl } from "./envs";

function createApi(baseURL: string) {
  const request = async (method: string, url: string, body?: unknown) => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${baseURL}/${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const error = new Error(data?.message || res.statusText);
      (error as any).response = { status: res.status, data };
      throw error;
    }

    return { data };
  };

  return {
    get: (url: string) => request("GET", url),
    post: (url: string, body?: unknown) => request("POST", url, body),
  };
}

export const api = createApi(getEnvsUrl());
export const apiSimulation = createApi(getEnvsUrl('VITE_SIMULATION_URL'));
