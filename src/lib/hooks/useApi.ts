// src/lib/hooks/useApi.ts
import { useState, useEffect, useCallback, useRef } from 'react';

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
    dependencies: readonly unknown[] = []
): UseApiReturn<T> => {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    // Используем useRef для предотвращения состояния гонки
    const cancelRef = useRef<boolean>(false);

    const fetchData = useCallback(async () => {
        cancelRef.current = false;
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const result = await apiCall();

            // Проверяем, не был ли отменен запрос
            if (!cancelRef.current) {
                setState({ data: result, loading: false, error: null });
            }
        } catch (error: unknown) {
            if (!cancelRef.current) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : 'Произошла ошибка';
                setState({ data: null, loading: false, error: errorMessage });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiCall, ...dependencies]);

    useEffect(() => {
        fetchData();

        // Cleanup функция для отмены запроса при размонтировании
        return () => {
            cancelRef.current = true;
        };
    }, [fetchData]);

    const reset = useCallback(() => {
        cancelRef.current = true;
        setState({ data: null, loading: false, error: null });
    }, []);

    const refetch = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    return {
        ...state,
        refetch,
        reset,
    };
};