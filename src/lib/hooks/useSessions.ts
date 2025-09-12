// src/lib/hooks/useSessions.ts
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

// Локальные типы (пока нет в @/types)
interface Session {
    id: number;
    therapist_id: number;
    client_id: number;
    start_time: string;
    end_time?: string;
    status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
    type: 'individual' | 'couple';
    notes?: string;
    rating?: {
        rating: number;
        comment?: string;
    };
    therapist: {
        id: number;
        name: string;
        specialization: string;
    };
    created_at: string;
}

interface UseSessionsReturn {
    sessions: Session[];
    loading: boolean;
    error: string | null;
    upcomingSessions: Session[];
    completedSessions: Session[];
    refetch: () => Promise<void>;
    cancelSession: (id: number, reason?: string) => Promise<boolean>;
    rateSession: (id: number, rating: number, comment?: string) => Promise<boolean>;
}

export const useSessions = (): UseSessionsReturn => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSessions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Используем apiClient напрямую
            const response = await apiClient.getSessions();

            if ('success' in response && response.success && 'data' in response && response.data && typeof response.data === 'object' && 'token' in response.data) {
                // Предполагаем, что response.data содержит массив сессий или объект с items
                const sessionsData = Array.isArray(response.data)
                    ? response.data
                    : response.data.items || [];
                setSessions(sessionsData);
            } else {
                setError(response.error || 'Failed to fetch sessions');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch sessions';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const cancelSession = useCallback(async (id: number, reason?: string) => {
        try {
            const response = await apiClient.cancelSession(id, reason);
            if (response.success) {
                setSessions(prev =>
                    prev.map(session =>
                        session.id === id
                            ? { ...session, status: 'cancelled' as const }
                            : session
                    )
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to cancel session:', error);
            return false;
        }
    }, []);

    const rateSession = useCallback(async (id: number, rating: number, comment?: string) => {
        try {
            // Добавляем метод в apiClient или используем общий post
            const response = await apiClient.post(`/sessions/${id}/rating`, {
                rating,
                comment
            });

            // Добавляем проверку типа для response
            if (response && typeof response === 'object' && 'success' in response && response.success) {
                setSessions(prev =>
                    prev.map(session =>
                        session.id === id
                            ? {
                                ...session,
                                rating: { rating, comment }
                            }
                            : session
                    )
                );
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to rate session:', error);
            return false;
        }
    }, []);

    const upcomingSessions = sessions.filter(session =>
        session.status === 'scheduled' || session.status === 'confirmed'
    );

    const completedSessions = sessions.filter(session =>
        session.status === 'completed'
    );

    return {
        sessions,
        loading,
        error,
        upcomingSessions,
        completedSessions,
        refetch: fetchSessions,
        cancelSession,
        rateSession,
    };
};