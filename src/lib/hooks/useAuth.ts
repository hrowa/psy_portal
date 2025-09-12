// src/lib/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';

// Типы для useAuth (можете вынести в отдельный файл types.ts)
interface User {
    id: number;
    email: string;
    name: string;
    phone?: string;
    role: 'client' | 'therapist' | 'admin';
    avatar?: string;
    created_at: string;
}

interface LoginCredentials {
    email: string;
    password: string;
    remember?: boolean;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: 'client' | 'therapist';
    phone?: string;
}

interface UseAuthReturn {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

// Тип для ответа API
interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
}

export const useAuth = (): UseAuthReturn => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                if (apiClient.isAuthenticated()) {
                    const currentUser = apiClient.getCurrentUser();
                    if (currentUser) {
                        setUser(currentUser);
                    } else {
                        // Если нет пользователя в localStorage, попробуем загрузить с сервера
                        try {
                            const response = await apiClient.get('/auth/profile') as ApiResponse<User>;

                            if (response.success && response.data) {
                                setUser(response.data);
                                // Сохраняем пользователя в localStorage
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem('user', JSON.stringify(response.data));
                                }
                            }
                        } catch (error) {
                            // Если не удалось загрузить профиль, очищаем токен
                            apiClient.removeAuthToken();
                        }
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                apiClient.removeAuthToken();
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = useCallback(async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true);
            const response = await apiClient.login(credentials) as ApiResponse<{ user: User; token: string }>;

            if (response.success && response.data) {
                setUser(response.data.user);
                return { success: true };
            } else {
                return { success: false, error: response.error || 'Ошибка входа' };
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка входа';
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (data: RegisterData) => {
        try {
            setIsLoading(true);
            const response = await apiClient.register(data) as ApiResponse;

            if (response.success) {
                return { success: true };
            } else {
                return { success: false, error: response.error || 'Ошибка регистрации' };
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка регистрации';
            return { success: false, error: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await apiClient.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    }, []);

    const updateProfile = useCallback(async (data: Partial<User>) => {
        try {
            const response = await apiClient.put('/auth/profile', data) as ApiResponse<User>;

            if (response.success && response.data) {
                setUser(response.data);
                // Обновляем пользователя в localStorage
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return { success: true };
            } else {
                return { success: false, error: response.error || 'Ошибка обновления профиля' };
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления профиля';
            return { success: false, error: errorMessage };
        }
    }, []);

    return {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
    };
};

// Экспортируем типы для использования в других компонентах
export type { User, LoginCredentials, RegisterData };