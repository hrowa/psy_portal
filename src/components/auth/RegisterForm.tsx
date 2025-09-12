// src/components/auth/RegisterForm.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/lib/hooks';
import { RegisterData } from '@/types';

export const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState<RegisterData>({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        role: 'client',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const router = useRouter();

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (formData.name.length < 2) {
            newErrors.name = 'Имя должно содержать минимум 2 символа';
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (formData.password.length < 8) {
            newErrors.password = 'Пароль должен содержать минимум 8 символов';
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const result = await register(formData);

            if (result.success) {
                router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email));
            } else {
                setErrors({ general: result.error || 'Ошибка регистрации' });
            }
        } catch (error) {
            setErrors({ general: 'Произошла ошибка. Попробуйте снова.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof RegisterData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));

        // Clear field error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="text-center">
                        <Link href="/" className="text-3xl font-bold text-blue-600">
                            PsyPortal
                        </Link>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        Создание аккаунта
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Уже есть аккаунт?{' '}
                        <Link
                            href="/auth/signin"
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            Войти
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {errors.general}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Я хочу:
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, role: 'client' }))}
                                    className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                                        formData.role === 'client'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Получать помощь
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, role: 'therapist' }))}
                                    className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                                        formData.role === 'therapist'
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    Оказывать помощь
                                </button>
                            </div>
                        </div>

                        <Input
                            label="Полное имя"
                            type="text"
                            value={formData.name}
                            onChange={handleChange('name')}
                            error={errors.name}
                            icon={<User className="h-4 w-4" />}
                            placeholder="Иван Иванов"
                            required
                        />

                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange('email')}
                            error={errors.email}
                            icon={<Mail className="h-4 w-4" />}
                            placeholder="your@email.com"
                            required
                        />

                        <Input
                            label="Телефон (необязательно)"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange('phone')}
                            error={errors.phone}
                            icon={<Phone className="h-4 w-4" />}
                            placeholder="+7 (999) 123-45-67"
                        />

                        <div className="relative">
                            <Input
                                label="Пароль"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange('password')}
                                error={errors.password}
                                icon={<Lock className="h-4 w-4" />}
                                placeholder="Минимум 8 символов"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        <div className="relative">
                            <Input
                                label="Подтверждение пароля"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.password_confirmation}
                                onChange={handleChange('password_confirmation')}
                                error={errors.password_confirmation}
                                icon={<Lock className="h-4 w-4" />}
                                placeholder="Повторите пароль"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="agree"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="agree" className="ml-2 block text-sm text-gray-900">
                            Я согласен с{' '}
                            <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                                условиями использования
                            </Link>{' '}
                            и{' '}
                            <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                                политикой конфиденциальности
                            </Link>
                        </label>
                    </div>

                    <Button
                        type="submit"
                        loading={isLoading}
                        className="w-full"
                        size="lg"
                    >
                        Создать аккаунт
                    </Button>
                </form>
            </div>
        </div>
    );
};