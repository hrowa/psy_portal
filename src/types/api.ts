// src/types/api.ts
import { User, AuthUser } from './user';
import { Therapist, TherapistFilters, TherapistAvailability } from './therapist';
import { Session, SessionFilters, BookingData } from './session';
import { Payment, PaymentMethod, CreatePaymentData } from './payment';
import { Notification } from './notification';
import { Review } from './review';
import { ApiResponse, PaginatedResponse } from './common';

// API Response Types
export interface LoginResponse extends ApiResponse<AuthUser> {}
export interface UserResponse extends ApiResponse<User> {}
export interface TherapistsResponse extends ApiResponse<PaginatedResponse<Therapist>> {}
export interface TherapistResponse extends ApiResponse<Therapist> {}
export interface SessionsResponse extends ApiResponse<PaginatedResponse<Session>> {}
export interface SessionResponse extends ApiResponse<Session> {}
export interface PaymentsResponse extends ApiResponse<PaginatedResponse<Payment>> {}
export interface NotificationsResponse extends ApiResponse<PaginatedResponse<Notification>> {}
export interface ReviewsResponse extends ApiResponse<PaginatedResponse<Review>> {}

// API Request Types
export interface GetTherapistsParams extends TherapistFilters {
    page?: number;
    per_page?: number;
    sort_by?: 'rating' | 'price' | 'experience' | 'created_at';
    sort_order?: 'asc' | 'desc';
}

export interface GetSessionsParams extends SessionFilters {
    page?: number;
    per_page?: number;
}

export interface GetAvailabilityParams {
    therapist_id: number;
    date_from: string;
    date_to: string;
}

// Stats and Analytics
export interface PlatformStats {
    total_therapists: number;
    total_sessions: number;
    active_therapists: number;
    average_rating: number;
    total_users: number;
}

export interface UserStats {
    total_sessions: number;
    upcoming_sessions: number;
    completed_sessions: number;
    total_spent: number;
    favorite_therapists: number;
}