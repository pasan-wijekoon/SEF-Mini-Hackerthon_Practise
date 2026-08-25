// Shared TypeScript types for the Report entity.
// Mirrors the Mongoose schema in server/src/models/Report.js (per README §3).

export type ReportType = 'Lost' | 'Found';
export type ReportStatus = 'Active' | 'Resolved';

export interface Report {
  _id: string;
  type: ReportType;
  itemName: string;
  category: string;
  location: string;
  /** ISO date string (Date from Mongoose serialised over JSON). */
  date: string;
  description: string;
  contactInfo: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
}

/** Payload for POST /api/reports — server-assigned fields are omitted. */
export type ReportInput = Omit<Report, '_id' | 'status' | 'createdAt' | 'updatedAt'>;
