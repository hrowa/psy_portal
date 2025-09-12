export * from './common';
export * from './user';
export * from './auth';
export * from './therapist';
export * from './session';
export * from './payment';
export * from './notification';
export * from './review';
export * from './chat';
// @ts-ignore
export * from './api';


export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    meta?: any;
}

export interface User {
    id: number;
    email: string;
    name: string;
    phone?: string;
    role: 'client' | 'therapist' | 'admin';
    avatar?: string;
    created_at: string;
}

export interface Therapist {
    id: number;
    user_id: number;
    user: User;
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

export interface LoginCredentials {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: 'client' | 'therapist';
    phone?: string;
}