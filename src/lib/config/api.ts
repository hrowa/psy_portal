// src/lib/config/api.ts

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    CHANGE_PASSWORD: '/auth/change-password',

    // Users
    USERS: '/users',
    USER_BY_ID: (id: number) => `/users/${id}`,

    // Therapists
    THERAPISTS: '/therapists',
    THERAPIST_BY_ID: (id: number) => `/therapists/${id}`,
    THERAPIST_AVAILABILITY: (id: number) => `/therapists/${id}/availability`,
    THERAPIST_REVIEWS: (id: number) => `/therapists/${id}/reviews`,
    POPULAR_THERAPISTS: '/therapists/popular',

    // Sessions
    SESSIONS: '/sessions',
    SESSION_BY_ID: (id: number) => `/sessions/${id}`,
    UPCOMING_SESSIONS: '/sessions/upcoming',
    SESSION_HISTORY: '/sessions/history',
    JOIN_SESSION: (id: number) => `/sessions/${id}/join`,
    CANCEL_SESSION: (id: number) => `/sessions/${id}/cancel`,
    RESCHEDULE_SESSION: (id: number) => `/sessions/${id}/reschedule`,
    RATE_SESSION: (id: number) => `/sessions/${id}/rate`,
    END_SESSION: (id: number) => `/sessions/${id}/end`,

    // Payments
    PAYMENTS: '/payments',
    PAYMENT_BY_ID: (id: number) => `/payments/${id}`,
    PAYMENT_METHODS: '/payment-methods',
    PAYMENT_METHOD_BY_ID: (id: number) => `/payment-methods/${id}`,
    SET_DEFAULT_PAYMENT_METHOD: (id: number) => `/payment-methods/${id}/set-default`,
    REFUND_PAYMENT: (id: number) => `/payments/${id}/refund`,

    // Notifications
    NOTIFICATIONS: '/notifications',
    NOTIFICATION_BY_ID: (id: number) => `/notifications/${id}`,
    MARK_NOTIFICATION_READ: (id: number) => `/notifications/${id}/read`,
    MARK_ALL_NOTIFICATIONS_READ: '/notifications/mark-all-read',
    UNREAD_NOTIFICATIONS_COUNT: '/notifications/unread-count',
    NOTIFICATION_PREFERENCES: '/notifications/preferences',

    // Stats
    PLATFORM_STATS: '/stats',
    USER_STATS: '/stats/user',

    // Reviews
    REVIEWS: '/reviews',
    REVIEW_BY_ID: (id: number) => `/reviews/${id}`,

    // Chat
    CHAT_ROOMS: '/chat/rooms',
    CHAT_ROOM_BY_ID: (id: number) => `/chat/rooms/${id}`,
    CHAT_MESSAGES: (roomId: number) => `/chat/rooms/${roomId}/messages`,
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
} as const;