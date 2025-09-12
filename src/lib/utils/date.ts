// src/lib/utils/date.ts
import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (date: string | Date, formatStr = 'dd MMMM yyyy'): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: ru });
};

export const formatTime = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'HH:mm');
};

export const formatDateTime = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'dd MMMM yyyy, HH:mm', { locale: ru });
};

export const formatRelativeTime = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;

    if (isToday(dateObj)) {
        return `Сегодня в ${formatTime(dateObj)}`;
    }

    if (isTomorrow(dateObj)) {
        return `Завтра в ${formatTime(dateObj)}`;
    }

    if (isYesterday(dateObj)) {
        return `Вчера в ${formatTime(dateObj)}`;
    }

    return formatDistanceToNow(dateObj, {
        addSuffix: true,
        locale: ru
    });
};

export const getTimeUntilSession = (sessionTime: string | Date): string => {
    const sessionDate = typeof sessionTime === 'string' ? parseISO(sessionTime) : sessionTime;
    const now = new Date();
    const diffMs = sessionDate.getTime() - now.getTime();

    if (diffMs <= 0) return 'Сессия началась';

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
        return `${diffDays} ${diffDays === 1 ? 'день' : diffDays < 5 ? 'дня' : 'дней'}`;
    }

    if (diffHours > 0) {
        return `${diffHours} ${diffHours === 1 ? 'час' : diffHours < 5 ? 'часа' : 'часов'}`;
    }

    return `${diffMinutes} ${diffMinutes === 1 ? 'минута' : diffMinutes < 5 ? 'минуты' : 'минут'}`;
};
