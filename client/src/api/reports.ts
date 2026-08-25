import type { Report, ReportFilters } from '../types/report';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error ${response.status}`);
    }

    return response.json();
}

export const reportsApi = {
    /**
     * Fetch all reports with optional filtering and search
     */
    async getReports(filters?: ReportFilters): Promise<Report[]> {
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
        return fetchJson<Report>(`${API_BASE_URL}/reports/${id}`);
    },

    /**
     * Create a new report
     */
    async createReport(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Report> {
        return fetchJson<Report>(`${API_BASE_URL}/reports`, {
            method: 'POST',
            body: JSON.stringify(report),
        });
    },

    /**
     * Mark a report as resolved
     */
    async resolveReport(id: string): Promise<Report> {
        return fetchJson<Report>(`${API_BASE_URL}/reports/${id}/resolve`, {
            method: 'PATCH',
        });
    },
};