// src/components/auth/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { authApi } from '@/lib/api';

export const ForgotPasswordForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authApi.forgotPassword({ email });

            if (response.success) {
                setIsSubmitted(true);
            } else {
                setError(response.error || 'Ошибка отправки письма');
            }
        } catch (error) {
            setError('Произошла ошибка. Попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <Mail className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Письмо отправлено
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Мы отправили инструкции по восстановлению пароля на {email}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-gray-500 text-center">
                            Не получили письмо? Проверьте папку спам или{' '}
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-blue-600 hover:text-blue-500 font-medium"
                            >
                                попробуйте снова
                            </button>
                        </p>

                        <Link
                            href="/auth/signin"
                            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Вернуться ко входу
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
                        Восстановление пароля
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Введите ваш email и мы отправим инструкции по восстановлению пароля
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail className="h-4 w-4" />}
                        placeholder="your@email.com"
                        required
                    />

                    <Button
                        type="submit"
                        loading={isLoading}
                        className="w-full"
                        size="lg"
                    >
                        Отправить инструкции
                    </Button>

                    <div className="text-center">
                        <Link
                            href="/auth/signin"
                            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Вернуться ко входу
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};