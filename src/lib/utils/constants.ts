// src/lib/utils/constants.ts
export const APP_CONFIG = {
    name: 'PsyPortal',
    description: 'Платформа онлайн-консультаций с психологами',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
};

export const SESSION_STATUSES = {
    SCHEDULED: 'scheduled',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no_show',
} as const;

export const SESSION_TYPES = {
    INDIVIDUAL: 'individual',
    COUPLE: 'couple',
    GROUP: 'group',
} as const;

export const USER_ROLES = {
    CLIENT: 'client',
    THERAPIST: 'therapist',
    ADMIN: 'admin',
} as const;

export const SPECIALIZATIONS = [
    'Тревожные расстройства',
    'Депрессия',
    'Семейная терапия',
    'Детская психология',
    'Зависимости',
    'Травма и ПТСР',
    'Расстройства пищевого поведения',
    'Биполярное расстройство',
    'ОКР',
    'Отношения и брак',
    'Самооценка',
    'Стресс и выгорание',
    'Горевание и потеря',
    'ЛГБТ+ вопросы',
] as const;

export const THERAPY_APPROACHES = [
    'Когнитивно-поведенческая терапия',
    'Психоанализ',
    'Гештальт-терапия',
    'Системная семейная терапия',
    'Экзистенциальная терапия',
    'Игровая терапия',
    'Арт-терапия',
    'EMDR',
    '12-шаговая программа',
    'Диалектическая поведенческая терапия',
    'Схема-терапия',
    'Нарративная терапия',
] as const;

export const LANGUAGES = [
    'Русский',
    'Английский',
    'Украинский',
    'Белорусский',
    'Казахский',
    'Немецкий',
    'Французский',
    'Испанский',
] as const;