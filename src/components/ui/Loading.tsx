// src/components/ui/Loading.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
                                                    size = 'md',
                                                    text,
                                                    className,
                                                }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className={clsx('flex flex-col items-center justify-center', className)}>
            <Loader2 className={clsx('animate-spin text-blue-600', sizes[size])} />
            {text && (
                <p className="mt-2 text-sm text-gray-600">{text}</p>
            )}
        </div>
    );
};