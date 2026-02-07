import React from 'react';

export const DashboardLoading: React.FC = () => {
    return (
        <div className="animate-pulse space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col space-y-2">
                <div className="h-8 bg-gray-800 rounded w-1/4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
            </div>
            <div className="h-px w-full bg-white/5" />

            {/* Hero Card Skeleton */}
            <div className="w-full h-72 bg-gray-800 rounded-2xl"></div>

            {/* KPI Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-64 bg-gray-800 rounded-2xl"></div>
                <div className="h-64 bg-gray-800 rounded-2xl"></div>
                <div className="h-64 bg-gray-800 rounded-2xl"></div>
            </div>

            {/* Heatmap & Breakdown Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-96 bg-gray-800 rounded-2xl"></div>
                <div className="h-96 bg-gray-800 rounded-2xl"></div>
            </div>

            {/* Metrics List Skeleton */}
            <div className="space-y-4">
                <div className="flex justify-between">
                    <div className="h-6 bg-gray-800 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-800 rounded w-24"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-800 rounded-xl"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};
