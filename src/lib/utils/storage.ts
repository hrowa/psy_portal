// src/lib/utils/storage.ts
export const storage = {
    get: <T>(key: string): T | null => {
        if (typeof window === 'undefined') return null;

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },

    set: <T>(key: string, value: T): void => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    remove: (key: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    },

    clear: (): void => {
        if (typeof window === 'undefined') return;
        localStorage.clear();
    }
};

export const sessionStorage = {
    get: <T>(key: string): T | null => {
        if (typeof window === 'undefined') return null;

        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },

    set: <T>(key: string, value: T): void => {
        if (typeof window === 'undefined') return;

        try {
            window.sessionStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to sessionStorage:', error);
        }
    },

    remove: (key: string): void => {
        if (typeof window === 'undefined') return;
        window.sessionStorage.removeItem(key);
    }
};