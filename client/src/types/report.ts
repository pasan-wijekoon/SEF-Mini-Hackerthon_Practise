export type ReportType = 'Lost' | 'Found';
export type ReportStatus = 'Active' | 'Resolved';

export interface Report {
    id: string;
    type: ReportType;
    itemName: string;
    category: string;
    location: string;
    date: string; // ISO date string
    description: string;
    contactInfo: string;
    status: ReportStatus;
    createdAt: string;
    updatedAt: string;
}

export interface ReportFilters {
    status?: ReportStatus;
    category?: string;
    search?: string;
}

export interface CreateReportInput {
    type: ReportType;
    itemName: string;
    category: string;
    location: string;
    date: string;
    description: string;
    contactInfo: string;
}