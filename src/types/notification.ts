import { BaseEntity } from './common';

export interface Notification extends BaseEntity {
    user_id: number;
    type: NotificationType;
    title: string;
    message: string;
    read_at?: string;
    action_url?: string;
    action_text?: string;
}

export type NotificationType =
    | 'session_reminder'
    | 'session_confirmed'
    | 'session_cancelled'
    | 'session_completed'
    | 'payment_success'
    | 'payment_failed'
    | 'new_message'
    | 'therapist_response'
    | 'system_announcement';

export interface NotificationPreferences {
    email_notifications: boolean;
    push_notifications: boolean;
    sms_notifications: boolean;
    session_reminders: boolean;
    payment_notifications: boolean;
    marketing_emails: boolean;
}