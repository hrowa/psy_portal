import { BaseEntity } from './common';
import { User } from './user';
import { Therapist } from './therapist';

export interface Review extends BaseEntity {
    client_id: number;
    therapist_id: number;
    session_id?: number;
    client: User;
    therapist: Therapist;
    rating: number; // 1-5
    comment?: string;
    tags?: string[];
    is_verified: boolean;
    is_published: boolean;
    helpful_count: number;
    response?: TherapistResponse;
}

export interface TherapistResponse extends BaseEntity {
    review_id: number;
    therapist_id: number;
    response: string;
}