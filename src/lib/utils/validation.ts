// src/lib/utils/validation.ts
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Пароль должен содержать минимум 8 символов');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Пароль должен содержать заглавную букву');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Пароль должен содержать строчную букву');
    }

    if (!/\d/.test(password)) {
        errors.push('Пароль должен содержать цифру');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export const validateName = (name: string): boolean => {
    return name.trim().length >= 2 && /^[а-яё\s\-A-Za-z]+$/i.test(name);
};
