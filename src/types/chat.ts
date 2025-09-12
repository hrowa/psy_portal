import { BaseEntity } from './common';
import { User } from './user';

export interface ChatRoom extends BaseEntity {
    session_id?: number;
    participants: User[];
    last_message?: ChatMessage;
    unread_count: number;
    is_active: boolean;
}

export interface ChatMessage extends BaseEntity {
    room_id: number;
    sender_id: number;
    sender: User;
    message: string;
    type: MessageType;
    metadata?: Record<string, any>;
    read_at?: string;
    edited_at?: string;
    deleted_at?: string;
}

export type MessageType = 'text' | 'image' | 'file' | 'system';