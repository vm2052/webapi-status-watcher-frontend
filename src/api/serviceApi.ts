import { Service } from "../components/ServiceCard";

const API_BASE = "http://localhost:5204/api/ServiceStatus"; // adjust port if needed

export async function getAllServices(): Promise<Service[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function getService(id: string) {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch service");
  return res.json();
}

export async function addService(data: {
  name: string;
  url: string;
  checkIntervalSeconds: number;
  lastChecked: string;
  createdAt: string;
  isHealthy: boolean;
  lastErrorMessage: string;
}) {
  console.log("addService");
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to add service");
  }

  return await response.json();
}

export async function deleteService(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete");
}

export async function checkService(id: string) {
  const res = await fetch(`${API_BASE}/${id}/check`, {
    method: "POST",
  });
  return res.json();
}

export async function checkAllServices() {
  const res = await fetch(`${API_BASE}/check-all`, {
    method: "POST",
  });
  return res.json();
}