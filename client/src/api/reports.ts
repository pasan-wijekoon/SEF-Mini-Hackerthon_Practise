import type { Report, ReportFilters } from '../types/report';
import { mockReports, mockDelay } from './mockReports';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const USE_MOCKS =
  import.meta.env.VITE_USE_MOCKS === 'true' ||
  !import.meta.env.VITE_API_BASE_URL;

/** Thrown for any non-2xx response from the backend. */
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      // ignore
    }
    throw new ApiError(errorMessage, response.status);
  }

  // Handle 204 No Content
  if (response.status === 204) return undefined as T;
  return response.json();
}

/** Filter mock reports in-memory (supports status, category, and search) */
function filterMockReports(filters?: ReportFilters): Report[] {
  let results = [...mockReports];
  if (filters?.status) {
    results = results.filter((r) => r.status === filters.status);
  }
  if (filters?.category) {
    results = results.filter((r) => r.category === filters.category);
  }
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    results = results.filter(
      (r) =>
        r.itemName.toLowerCase().includes(search) ||
        (r.description && r.description.toLowerCase().includes(search)) ||
        (r.location && r.location.toLowerCase().includes(search))
    );
  }
  return results;
}

export const reportsApi = {
  /**
   * Fetch all reports with optional filtering and search
   */
  async getReports(filters?: ReportFilters): Promise<Report[]> {
    if (USE_MOCKS) {
      await mockDelay();
      return filterMockReports(filters);
    }

    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);
    const queryString = params.toString();
    const url = `${API_BASE_URL}/reports${queryString ? `?${queryString}` : ''}`;

    return fetchJson<Report[]>(url);
  },

  /**
   * Fetch a single report by ID
   */
  async getReportById(id: string): Promise<Report> {
    if (USE_MOCKS) {
      await mockDelay();
      const found = mockReports.find((r) => r._id === id);
      if (!found) throw new ApiError(`Report ${id} not found`, 404);
      return { ...found };
    }
    return fetchJson<Report>(
      `${API_BASE_URL}/reports/${encodeURIComponent(id)}`
    );
  },

  /**
   * Create a new report
   */
  async createReport(
    report: Omit<Report, '_id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<Report> {
    if (USE_MOCKS) {
      await mockDelay();
      const now = new Date().toISOString();
      const newReport: Report = {
        ...report,
        _id: `mock-${Date.now()}`,
        status: 'Active',
        createdAt: now,
        updatedAt: now,
      };
      mockReports.unshift(newReport);
      return { ...newReport };
    }
    return fetchJson<Report>(`${API_BASE_URL}/reports`, {
      method: 'POST',
      body: JSON.stringify(report),
    });
  },

  /**
   * Mark a report as resolved
   */
  async resolveReport(id: string): Promise<Report> {
    if (USE_MOCKS) {
      await mockDelay();
      const idx = mockReports.findIndex((r) => r._id === id);
      if (idx === -1) throw new ApiError(`Report ${id} not found`, 404);
      const now = new Date().toISOString();
      const updated: Report = {
        ...mockReports[idx],
        status: 'Resolved',
        updatedAt: now,
      };
      mockReports[idx] = updated;
      return { ...updated };
    }
    return fetchJson<Report>(
      `${API_BASE_URL}/reports/${encodeURIComponent(id)}/resolve`,
      {
        method: 'PATCH',
      }
    );
  },
};

// Flat named exports — some pages import individual functions instead of
// the `reportsApi` object; both styles stay in sync since they share the
// same implementation.
export const { getReports, getReportById, createReport, resolveReport } =
  reportsApi;
