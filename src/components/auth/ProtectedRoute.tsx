// src/components/auth/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Loading } from '@/components/ui';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'client' | 'therapist' | 'admin';
    redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                  children,
                                                                  requiredRole,
                                                                  redirectTo = '/auth/signin',
                                                              }) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push(redirectTo);
                return;
            }

            if (requiredRole && user?.role !== requiredRole) {
                // Redirect based on user role
                if (user?.role === 'client') {
                    router.push('/dashboard');
                } else if (user?.role === 'therapist') {
                    router.push('/therapist/dashboard');
                } else {
                    router.push('/');
                }
                return;
            }
        }
    }, [isAuthenticated, isLoading, user, requiredRole, router, redirectTo]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading size="lg" text="Загрузка..." />
            </div>
        );
    }

    if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading size="lg" text="Перенаправление..." />
            </div>
        );
    }

    return <>{children}</>;
};