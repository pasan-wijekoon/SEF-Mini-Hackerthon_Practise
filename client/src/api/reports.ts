import type { Report, ReportInput } from '../types/report';
import { mockReports, mockDelay } from './mockReports';

/**
 * Typed fetch wrappers for the backend report API.
 *
 * When VITE_USE_MOCKS is 'true' (or the API base URL is not configured),
 * calls are routed to the in-memory mock dataset in mockReports.ts so the
 * UI works end-to-end before the backend is live. Flip VITE_USE_MOCKS to
 * 'false' once Member 1's controller is ready and no consumer code needs
 * to change.
 */

const RAW_BASE = import.meta.env.VITE_API_BASE_URL as string | undefined;
const BASE = RAW_BASE && RAW_BASE.length > 0 ? RAW_BASE : 'http://localhost:5000/api';
const USE_MOCKS =
  (import.meta.env.VITE_USE_MOCKS as string | undefined) === 'true' ||
  !import.meta.env.VITE_API_BASE_URL;

class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) {
    let bodyText = '';
    try {
      bodyText = await res.text();
    } catch {
      // ignore body read errors
    }
    throw new HttpError(
      `Request failed (${res.status} ${res.statusText})${bodyText ? `: ${bodyText}` : ''}`,
      res.status,
    );
  }
  // 204 No Content support
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/* ----- Public API ---------------------------------------------------- */

export async function getReports(): Promise<Report[]> {
  if (USE_MOCKS) {
    await mockDelay();
    return [...mockReports];
  }
  return request<Report[]>('/reports');
}

export async function getReportById(id: string): Promise<Report> {
  if (USE_MOCKS) {
    await mockDelay();
    const found = mockReports.find((r) => r._id === id);
    if (!found) throw new HttpError(`Report ${id} not found`, 404);
    return { ...found };
  }
  return request<Report>(`/reports/${encodeURIComponent(id)}`);
}

export async function resolveReport(id: string): Promise<Report> {
  if (USE_MOCKS) {
    await mockDelay();
    const idx = mockReports.findIndex((r) => r._id === id);
    if (idx === -1) throw new HttpError(`Report ${id} not found`, 404);
    const now = new Date().toISOString();
    const updated: Report = {
      ...mockReports[idx],
      status: 'Resolved',
      updatedAt: now,
    };
    mockReports[idx] = updated;
    return { ...updated };
  }
  return request<Report>(`/reports/${encodeURIComponent(id)}/resolve`, {
    method: 'PATCH',
  });
}

export async function createReport(payload: ReportInput): Promise<Report> {
  if (USE_MOCKS) {
    await mockDelay();
    const now = new Date().toISOString();
    const created: Report = {
      ...payload,
      _id: `mock-${Date.now()}`,
      status: 'Active',
      createdAt: now,
      updatedAt: now,
    };
    mockReports.unshift(created);
    return { ...created };
  }
  return request<Report>('/reports', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
