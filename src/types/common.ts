export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    meta?: any;
}

export interface PaginationMeta {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

export interface PaginatedResponse<T> {
    items: T[];
    meta: PaginationMeta;
}

export type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';

export interface BaseEntity {
    id: number;
    created_at: string;
    updated_at?: string;
}