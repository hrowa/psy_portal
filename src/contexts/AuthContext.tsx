// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_BASE = 'http://localhost:8080/api/v1';

interface User {
    id: number;
    email: string;
    name: string;
    phone?: string;
    avatar?: string;
    role: 'client' | 'therapist' | 'admin';
    is_email_verified: boolean;
    last_login_at?: string;
    created_at: string;
    updated_at: string;
}

interface Tokens {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

interface AuthContextType {
    user: User | null;
    tokens: Tokens | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
    register: (userData: { email: string; password: string; name: string; phone?: string; role?: string }) => Promise<{ success: boolean; error?: string; message?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const api = {
    register: async (userData: any) => {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        return response.json();
    },

    login: async (credentials: any) => {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        return response.json();
    },

    logout: async (refreshToken: string) => {
        const response = await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });
        return response.json();
    },

    getProfile: async (accessToken: string) => {
        const response = await fetch(`${API_BASE}/profile`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        return response.json();
    },
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [tokens, setTokens] = useState<Tokens | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored tokens on app startup
        const storedTokens = localStorage.getItem('auth_tokens');
        const storedUser = localStorage.getItem('auth_user');

        if (storedTokens && storedUser) {
            try {
                setTokens(JSON.parse(storedTokens));
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Failed to parse stored auth data:', error);
                localStorage.removeItem('auth_tokens');
                localStorage.removeItem('auth_user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        try {
            const response = await api.login(credentials);
            if (response.success) {
                const { user, tokens } = response.data;
                setUser(user);
                setTokens(tokens);
                localStorage.setItem('auth_tokens', JSON.stringify(tokens));
                localStorage.setItem('auth_user', JSON.stringify(user));
                return { success: true };
            } else {
                return { success: false, error: response.error };
            }
        } catch (error) {
            return { success: false, error: 'Ошибка подключения к серверу' };
        }
    };

    const register = async (userData: { email: string; password: string; name: string; phone?: string; role?: string }) => {
        try {
            const response = await api.register(userData);
            if (response.success) {
                return { success: true, message: response.data.message };
            } else {
                return { success: false, error: response.error };
            }
        } catch (error) {
            return { success: false, error: 'Ошибка подключения к серверу' };
        }
    };

    const logout = async () => {
        try {
            if (tokens?.refresh_token) {
                await api.logout(tokens.refresh_token);
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setTokens(null);
            localStorage.removeItem('auth_tokens');
            localStorage.removeItem('auth_user');
        }
    };

    const value: AuthContextType = {
        user,
        tokens,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};