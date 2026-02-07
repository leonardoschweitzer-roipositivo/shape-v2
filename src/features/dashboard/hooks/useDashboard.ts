import { useState, useEffect } from 'react';
import { DashboardResponse } from '../types';
import { mockDashboardData } from '../services/mockDashboardData';

export function useDashboard() {
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setIsLoading(true);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));
                setData(mockDashboardData);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    return { data, isLoading, error };
}
