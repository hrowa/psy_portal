// src/lib/utils/helpers.ts
export const clsx = (...classes: (string | undefined | null | boolean)[]): string => {
    return classes.filter(Boolean).join(' ');
};

export const generateInitials = (name: string): string => {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'scheduled':
        case 'confirmed':
            return 'text-blue-600 bg-blue-100';
        case 'in_progress':
            return 'text-yellow-600 bg-yellow-100';
        case 'completed':
            return 'text-green-600 bg-green-100';
        case 'cancelled':
        case 'no_show':
            return 'text-red-600 bg-red-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
};

export const getStatusText = (status: string): string => {
    switch (status) {
        case 'scheduled': return 'Запланирована';
        case 'confirmed': return 'Подтверждена';
        case 'in_progress': return 'В процессе';
        case 'completed': return 'Завершена';
        case 'cancelled': return 'Отменена';
        case 'no_show': return 'Не явился';
        default: return 'Неизвестно';
    }
};

export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;

    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

export const generateRandomId = (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            textArea.remove();
            return true;
        } catch {
            textArea.remove();
            return false;
        }
    }
};