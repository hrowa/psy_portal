const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Типы для API ответов (добавьте в types.ts если нужно)
interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    meta?: any;
}

interface Stats {
    total_therapists: number;
    total_sessions: number;
    active_therapists: number;
    average_rating: number;
}

interface Therapist {
    id: number;
    user_id: number;
    user: {
        id: number;
        name: string;
        email: string;
        phone: string;
    };
    specialization: string;
    approach: string;
    experience: number;
    price_per_hour: number;
    rating: number;
    review_count: number;
    bio: string;
    languages: string;
    is_online: boolean;
    created_at: string;
}

interface TherapistListResponse {
    therapists: Therapist[];
    total: number;
    page: number;
    per_page: number;
}

class ApiClient {
    private getAuthToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('auth_token');
        }
        return null;
    }

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const url = `${API_BASE}${endpoint}`;

        // Добавляем токен авторизации если есть
        const token = this.getAuthToken();

        // Create a Headers object - this is the recommended approach
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        // Handle existing headers from options
        if (options?.headers) {
            if (options.headers instanceof Headers) {
                for (const [key, value] of options.headers.entries()) {
                    headers.append(key, value);
                }
            } else if (typeof options.headers === 'object') {
                // Type assertion to handle the Record<string, string> case
                const headerObject = options.headers as Record<string, string>;
                for (const key in headerObject) {
                    if (Object.prototype.hasOwnProperty.call(headerObject, key)) {
                        const value = headerObject[key];
                        if (value !== null && value !== undefined) {
                            headers.append(key, String(value));
                        }
                    }
                }
            }
        }

        // Add authorization token if available
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers, // Use the Headers object directly
            });

            // Обработка 401 ошибки (неавторизован)
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/auth/signin';
                }
                throw new Error('Unauthorized');
            }

            if (!response.ok) {
                // Пытаемся получить детали ошибки из ответа
                let errorMessage = `API Error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    if (errorData.error) {
                        errorMessage = errorData.error;
                    }
                } catch {
                    // Если не удалось распарсить JSON, используем статус
                }
                throw new Error(errorMessage);
            }

            return response.json();
        } catch (error) {
            // Обработка сетевых ошибок
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Нет подключения к серверу');
            }
            throw error;
        }
    }

    // HTTP методы
    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    // Методы для работы с API
    async getStats(): Promise<ApiResponse<Stats>> {
        return this.get<ApiResponse<Stats>>('/stats');
    }

    async getTherapists(params?: {
        page?: number;
        per_page?: number;
        specialization?: string;
        approach?: string;
        min_experience?: number;
        max_price?: number;
        online_only?: boolean;
    }): Promise<ApiResponse<TherapistListResponse>> {
        const searchParams = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, String(value));
                }
            });
        }

        const query = searchParams.toString();
        const endpoint = `/therapists${query ? `?${query}` : ''}`;

        return this.get<ApiResponse<TherapistListResponse>>(endpoint);
    }

    async getTherapistById(id: number): Promise<ApiResponse<Therapist>> {
        return this.get<ApiResponse<Therapist>>(`/therapists/${id}`);
    }

    // Методы аутентификации
    async login(credentials: { email: string; password: string; remember?: boolean }) {
        const response = await this.post<ApiResponse<{ user: any; token: string }>>('/auth/login', credentials);

        // Сохраняем токен если авторизация успешна
        if (response.success && response.data?.token) {
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
        }

        return response;
    }

    async register(data: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        role?: 'client' | 'therapist';
        phone?: string;
    }) {
        return this.post<ApiResponse<any>>('/auth/register', data);
    }

    async logout() {
        try {
            await this.post<ApiResponse<void>>('/auth/logout');
        } finally {
            // Всегда очищаем локальные данные
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
            }
        }
    }

    // Методы восстановления пароля
    async forgotPassword(data: { email: string }): Promise<ApiResponse<void>> {
        return this.post<ApiResponse<void>>('/auth/forgot-password', data);
    }

    async resetPassword(token: string, password: string, password_confirmation: string): Promise<ApiResponse<void>> {
        return this.post<ApiResponse<void>>('/auth/reset-password', {
            token,
            password,
            password_confirmation
        });
    }

    // Метод верификации email
    async verifyEmail(token: string): Promise<ApiResponse<void>> {
        return this.post<ApiResponse<void>>('/auth/verify-email', { token });
    }

    // Метод повторной отправки письма подтверждения
    async resendVerification(email: string): Promise<ApiResponse<void>> {
        return this.post<ApiResponse<void>>('/auth/resend-verification', { email });
    }

    // Методы для сессий
    async getSessions(params?: {
        page?: number;
        per_page?: number;
        status?: string;
        date_from?: string;
        date_to?: string;
    }) {
        const searchParams = new URLSearchParams();

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, String(value));
                }
            });
        }

        const query = searchParams.toString();
        const endpoint = `/sessions${query ? `?${query}` : ''}`;

        return this.get<ApiResponse<any>>(endpoint);
    }

    async bookSession(data: {
        therapist_id: number;
        start_time: string;
        type: 'individual' | 'couple';
        notes?: string;
    }) {
        return this.post<ApiResponse<any>>('/sessions', data);
    }

    async cancelSession(id: number, reason?: string) {
        return this.post<ApiResponse<any>>(`/sessions/${id}/cancel`, { reason });
    }

    // Утилитарные методы
    setAuthToken(token: string) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    }

    removeAuthToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
        }
    }

    getCurrentUser() {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    }

    isAuthenticated(): boolean {
        return !!this.getAuthToken();
    }
}

export const apiClient = new ApiClient();

// Экспортируем типы для использования в компонентах
export type { ApiResponse, Stats, Therapist, TherapistListResponse };