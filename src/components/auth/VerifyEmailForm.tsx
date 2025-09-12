// src/components/auth/VerifyEmailForm.tsx
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui';
import { authApi } from '@/lib/api';

export const VerifyEmailForm: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [countdown, setCountdown] = useState(60);

    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            verifyEmail(token);
        }
    }, [token]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const verifyEmail = async (verificationToken: string) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await authApi.verifyEmail({
                token: verificationToken,
                email,
            });

            if (response.success) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/auth/signin?verified=true');
                }, 3000);
            } else {
                setError(response.error || 'Ошибка подтверждения email');
            }
        } catch (error) {
            setError('Произошла ошибка. Попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    const resendVerification = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await authApi.resendVerification(email);

            if (response.success) {
                setCanResend(false);
                setCountdown(60);
            } else {
                setError(response.error || 'Ошибка отправки письма');
            }
        } catch (error) {
            setError('Произошла ошибка. Попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Email подтвержден!
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Ваш аккаунт успешно активирован. Сейчас вы будете перенаправлены на страницу входа.
                        </p>
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
                    <div className="text-center mt-6">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                            <Mail className="h-6 w-6 text-blue-600" />
                        </div>
                        <h2 className="mt-6 text-3xl font-bold text-gray-900">
                            Подтвердите ваш email
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Мы отправили письмо с подтверждением на {email}
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <p className="text-sm text-gray-500 text-center">
                        Не получили письмо? Проверьте папку спам или отправьте письмо повторно.
                    </p>

                    <Button
                        onClick={resendVerification}
                        disabled={!canResend || isLoading}
                        loading={isLoading}
                        variant="outline"
                        className="w-full"
                    >
                        {canResend
                            ? 'Отправить повторно'
                            : `Отправить повторно (${countdown}с)`
                        }
                    </Button>

                    <div className="text-center">
                        <Link
                            href="/auth/signin"
                            className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                            Вернуться ко входу
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};