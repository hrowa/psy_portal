import { BaseEntity } from './common';

export interface Payment extends BaseEntity {
    session_id?: number;
    user_id: number;
    amount: number; // in kopecks
    currency: string;
    status: PaymentStatus;
    payment_method: PaymentMethod;
    transaction_id?: string;
    provider_payment_id?: string;
    description?: string;
    processed_at?: string;
    failed_at?: string;
    failure_reason?: string;
    refunded_at?: string;
    refund_amount?: number;
}

export type PaymentStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'cancelled'
    | 'refunded'
    | 'partially_refunded';

export interface PaymentMethod extends BaseEntity {
    user_id: number;
    type: PaymentMethodType;
    provider: PaymentProvider;
    provider_payment_method_id: string;
    is_default: boolean;
    last_four?: string;
    brand?: string;
    expires_at?: string;
}

export type PaymentMethodType = 'card' | 'bank_account' | 'digital_wallet';
export type PaymentProvider = 'stripe' | 'yookassa' | 'paypal';

export interface CreatePaymentData {
    amount: number;
    currency: string;
    payment_method_id: string;
    description?: string;
    metadata?: Record<string, any>;
}
