// src/lib/hooks/useTherapists.ts
import { useState, useEffect, useCallback } from 'react';
import { apiClient, type Therapist, type TherapistListResponse } from '@/lib/api';

interface TherapistFilters {
    page?: number;
    per_page?: number;
    specialization?: string;
    approach?: string;
    min_experience?: number;
    max_price?: number;
    online_only?: boolean;
}

interface UseTherapistsReturn {
    therapists: Therapist[];
    loading: boolean;
    error: string | null;
    totalPages: number;
    currentPage: number;
    filters: TherapistFilters;
    setFilters: (filters: TherapistFilters) => void;
    setPage: (page: number) => void;
    refetch: () => Promise<void>;
}

export const useTherapists = (): UseTherapistsReturn => {
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<TherapistFilters>({
        page: 1,
        per_page: 12
    });

    const fetchTherapists = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiClient.getTherapists({
                ...filters,
                page: currentPage
            });

            if (response.success && response.data) {
                setTherapists(response.data.therapists);
                // Вычисляем общее количество страниц
                const totalPages = Math.ceil(response.data.total / (filters.per_page || 12));
                setTotalPages(totalPages);
            } else {
                setError(response.error || 'Ошибка загрузки психологов');
            }
        } catch (error: any) {
            setError(error.message || 'Ошибка загрузки психологов');
        } finally {
            setLoading(false);
        }
    }, [filters, currentPage]);

    useEffect(() => {
        fetchTherapists();
    }, [fetchTherapists]);

    const setPage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const updateFilters = useCallback((newFilters: TherapistFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); // Сбрасываем на первую страницу при изменении фильтров
    }, []);

    return {
        therapists,
        loading,
        error,
        totalPages,
        currentPage,
        filters,
        setFilters: updateFilters,
        setPage,
        refetch: fetchTherapists,
    };
};