// src/lib/hooks/useSessions.ts
import { useState, useEffect, useCallback } from 'react';
import { sessionsApi } from '@/lib/api';
import { Session, GetSessionsParams } from '@/types';

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

            const response = await sessionsApi.getSessions();

            if (response.success && response.data) {
                setSessions(response.data.items);
            } else {
                setError(response.error || 'Failed to fetch sessions');
            }
        } catch (error: any) {
            setError(error.message || 'Failed to fetch sessions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    const cancelSession = useCallback(async (id: number, reason?: string) => {
        try {
            const response = await sessionsApi.cancelSession(id, reason);
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
            const response = await sessionsApi.rateSession(id, { rating, comment });
            if (response.success) {
                setSessions(prev =>
                    prev.map(session =>
                        session.id === id
                            ? { ...session, rating: response.data }
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