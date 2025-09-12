// src/components/ui/Input.tsx
import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helper?: string;
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
                                                label,
                                                error,
                                                helper,
                                                icon,
                                                iconPosition = 'left',
                                                className,
                                                id,
                                                ...props
                                            }) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && iconPosition === 'left' && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">{icon}</span>
                    </div>
                )}

                <input
                    id={inputId}
                    className={clsx(
                        'block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:bg-gray-50 disabled:text-gray-500',
                        icon && iconPosition === 'left' && 'pl-10',
                        icon && iconPosition === 'right' && 'pr-10',
                        error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
                        className
                    )}
                    {...props}
                />

                {icon && iconPosition === 'right' && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">{icon}</span>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}

            {helper && !error && (
                <p className="mt-1 text-sm text-gray-500">{helper}</p>
            )}
        </div>
    );
};