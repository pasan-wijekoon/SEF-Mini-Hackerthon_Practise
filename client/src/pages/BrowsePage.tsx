import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { reportsApi } from '../api/reports';
import { ReportCard } from '../components/ReportCard';
import { FilterBar } from '../components/FilterBar';
import type { Report, ReportFilters } from '../types/report';

export default function BrowsePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({});

  const fetchReports = useCallback(async (currentFilters: ReportFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reportsApi.getReports(currentFilters);
      setReports(data);

      // Extract unique categories from all reports (not just filtered)
      if (currentFilters.search || currentFilters.status || currentFilters.category) {
        // If we have filters, we might want to fetch all categories separately
        // For now, extract from current results
        const uniqueCategories = [...new Set(data.map(r => r.category))].sort();
        setCategories(uniqueCategories);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
      console.error('Error fetching reports:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all categories on mount
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const allReports = await reportsApi.getReports({});
        const uniqueCategories = [...new Set(allReports.map(r => r.category))].sort();
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchAllCategories();
  }, []);

  // Fetch reports when filters change
  useEffect(() => {
    fetchReports(filters);
  }, [filters, fetchReports]);

  const handleFilterChange = (newFilters: ReportFilters) => {
    setFilters(newFilters);
  };

  if (isLoading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <svg className="mx-auto h-16 w-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Failed to load reports</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={() => fetchReports(filters)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
          <p className="mt-2 text-gray-600">
            Search and filter through lost and found reports across campus
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          onFilterChange={handleFilterChange}
          initialFilters={filters}
          categories={categories}
        />

        {/* Results */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {reports.length === 0 ? 'No reports found' :
                reports.length === 1 ? '1 report found' :
                  `${reports.length} reports found`}
            </p>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-16">
              <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No reports found</h3>
              <p className="mt-2 text-gray-500">
                {filters.search || filters.status || filters.category
                  ? 'Try adjusting your filters or search terms.'
                  : 'No reports have been submitted yet. Be the first to report a lost or found item!'}
              </p>
              {(!filters.search && !filters.status && !filters.category) && (
                <Link
                  to="/report"
                  className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Submit a Report
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reports.map((report) => (
                <Link key={report._id} to={`/reports/${report._id}`}>
                  <ReportCard report={report} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}