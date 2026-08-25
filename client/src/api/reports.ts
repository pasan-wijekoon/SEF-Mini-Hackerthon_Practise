import type { ReportForm } from "../utils/validation";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export type Report = {
  _id: string;
  type: "Lost" | "Found";
  itemName: string;
  category: string;
  location: string;
  date: string;
  description: string;
  contactInfo: string;
  status: "Active" | "Resolved";
  createdAt: string;
  updatedAt: string;
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) msg = body.message;
    } catch {
      /* body may not be JSON */
    }
    throw new ApiError(msg, res.status);
  }
  return res.json() as Promise<T>;
}

export async function getReports(params?: {
  status?: string;
  category?: string;
  search?: string;
}): Promise<Report[]> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.category) qs.set("category", params.category);
  if (params?.search) qs.set("search", params.search);
  const q = qs.toString();
  return handle<Report[]>(await fetch(`${BASE}/reports${q ? `?${q}` : ""}`));
}

export async function getReport(id: string): Promise<Report> {
  return handle<Report>(await fetch(`${BASE}/reports/${id}`));
}

export async function createReport(payload: ReportForm): Promise<Report> {
  return handle<Report>(
    await fetch(`${BASE}/reports`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
  );
}

export async function resolveReport(id: string): Promise<Report> {
  return handle<Report>(
    await fetch(`${BASE}/reports/${id}/resolve`, { method: "PATCH" })
  );
}
