import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import type { ReportFilters, ReportStatus } from '../types/report';

interface FilterBarProps {
    onFilterChange: (filters: ReportFilters) => void;
    initialFilters?: ReportFilters;
    categories?: string[];
}

export function FilterBar({ onFilterChange, initialFilters = {}, categories = [] }: FilterBarProps) {
    const [filters, setFilters] = useState<ReportFilters>({
        status: initialFilters.status,
        category: initialFilters.category,
        search: initialFilters.search,
    });

    const [debouncedSearch, setDebouncedSearch] = useState(filters.search || '');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(filters.search || '');
            onFilterChange({ ...filters, search: filters.search });
        }, 300);

        return () => clearTimeout(timer);
    }, [filters.search, onFilterChange]);

    // Sync other filters immediately
    useEffect(() => {
        if (filters.status !== initialFilters.status || filters.category !== initialFilters.category) {
            onFilterChange(filters);
        }
    }, [filters.status, filters.category, initialFilters.status, initialFilters.category, onFilterChange]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, search: e.target.value }));
    };

    const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, status: e.target.value as ReportStatus | undefined }));
    };

    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, category: e.target.value || undefined }));
    };

    const handleClearFilters = () => {
        setFilters({ status: undefined, category: undefined, search: '' });
        onFilterChange({});
    };

    const hasActiveFilters = Boolean(filters.status || filters.category || filters.search);

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <form onSubmit={(e: FormEvent) => e.preventDefault()} className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-12 gap-4">
                {/* Search Input - takes 6 columns on small screens, 4 on medium */}
                <div className="sm:col-span-6 lg:col-span-4">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                    </label>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            id="search"
                            value={filters.search || ''}
                            onChange={handleSearchChange}
                            placeholder="Search items, descriptions..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            aria-label="Search reports"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div className="sm:col-span-3 lg:col-span-2">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        id="status"
                        value={filters.status || ''}
                        onChange={handleStatusChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        aria-label="Filter by status"
                    >
                        <option value="">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>

                {/* Category Filter */}
                <div className="sm:col-span-3 lg:col-span-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                    </label>
                    <select
                        id="category"
                        value={filters.category || ''}
                        onChange={handleCategoryChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
                        aria-label="Filter by category"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Active filters summary */}
                <div className="sm:col-span-12 lg:col-span-4">
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2">
                            {filters.search && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                    <span>"{filters.search}"</span>
                                    <button
                                        type="button"
                                        onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                                        className="hover:text-blue-900"
                                        aria-label="Remove search filter"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                            {filters.status && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                                    <span>{filters.status}</span>
                                    <button
                                        type="button"
                                        onClick={() => setFilters(prev => ({ ...prev, status: undefined }))}
                                        className="hover:text-green-900"
                                        aria-label="Remove status filter"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                            {filters.category && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                                    <span>{filters.category}</span>
                                    <button
                                        type="button"
                                        onClick={() => setFilters(prev => ({ ...prev, category: undefined }))}
                                        className="hover:text-purple-900"
                                        aria-label="Remove category filter"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}