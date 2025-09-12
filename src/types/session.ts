import { BaseEntity, Status } from './common';
import { User } from './user';
import { Therapist } from './therapist';

export interface Session extends BaseEntity {
    client_id: number;
    therapist_id: number;
    client: User;
    therapist: Therapist;
    start_time: string;
    end_time: string;
    status: SessionStatus;
    type: SessionType;
    price: number;
    duration: number; // minutes
    notes?: string;
    client_notes?: string;
    therapist_notes?: string;
    rating?: SessionRating;
    payment?: Payment;
    video_room_id?: string;
    cancelled_reason?: string;
    cancelled_by?: 'client' | 'therapist' | 'system';
    cancelled_at?: string;
}

export type SessionStatus =
    | 'scheduled'
    | 'confirmed'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show';

export type SessionType = 'individual' | 'couple' | 'group';

export interface SessionRating extends BaseEntity {
    session_id: number;
    rating: number; // 1-5
    comment?: string;
    tags?: string[];
}

export interface BookingData {
    therapist_id: number;
    start_time: string;
    type: SessionType;
    notes?: string;
    payment_method_id?: string;
}

export interface SessionFilters {
    status?: SessionStatus;
    type?: SessionType;
    date_from?: string;
    date_to?: string;
    therapist_id?: number;
}