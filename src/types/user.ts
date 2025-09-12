import { BaseEntity } from './common';

export interface User extends BaseEntity {
    email: string;
    name: string;
    phone?: string;
    role: 'client' | 'therapist' | 'admin';
    avatar?: string;
    email_verified_at?: string;
    profile?: UserProfile;
}

export interface UserProfile {
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other';
    bio?: string;
    timezone?: string;
    language?: string;
    notifications_enabled: boolean;
    marketing_emails_enabled: boolean;
}

export interface AuthUser {
    user: User;
    token: string;
    expires_at: string;
}