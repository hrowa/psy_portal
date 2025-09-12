import { BaseEntity, Status } from './common';
import { User } from './user';

export interface Therapist extends BaseEntity {
    user_id: number;
    user: User;
    specialization: string;
    approach: string;
    experience: number; // years
    price_per_hour: number; // in kopecks
    rating: number;
    review_count: number;
    bio: string;
    languages: string[]; // Will be parsed from JSON string
    is_online: boolean;
    status: Status;
    next_available_slot?: string;
    education: Education[];
    certifications: Certification[];
    working_hours: WorkingHours;
}

export interface Education {
    institution: string;
    degree: string;
    field_of_study: string;
    start_year: number;
    end_year?: number;
    description?: string;
}

export interface Certification {
    name: string;
    issuing_organization: string;
    issue_date: string;
    expiry_date?: string;
    credential_id?: string;
}

export interface WorkingHours {
    monday?: TimeSlot[];
    tuesday?: TimeSlot[];
    wednesday?: TimeSlot[];
    thursday?: TimeSlot[];
    friday?: TimeSlot[];
    saturday?: TimeSlot[];
    sunday?: TimeSlot[];
}

export interface TimeSlot {
    start: string; // HH:mm format
    end: string;   // HH:mm format
}

export interface TherapistFilters {
    specialization?: string;
    approach?: string;
    min_experience?: number;
    max_price?: number;
    languages?: string[];
    is_online?: boolean;
    rating?: number;
    search?: string;
}

export interface TherapistAvailability {
    date: string;
    slots: AvailableSlot[];
}

export interface AvailableSlot {
    start_time: string;
    end_time: string;
    is_available: boolean;
    price?: number;
}