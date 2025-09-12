// src/lib/hooks/useApi.ts
import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
    refetch: () => Promise<void>;
    reset: () => void;
}

export const useApi = <T>(
    apiCall: () => Promise<T>,
    dependencies: any[] = []
): UseApiReturn<T> => {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const result = await apiCall();
            setState({ data: result, loading: false, error: null });
        } catch (error: any) {
            setState({ data: null, loading: false, error: error.message || 'Произошла ошибка' });
        }
    }, dependencies);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    return {
        ...state,
        refetch: fetchData,
        reset,
    };
};