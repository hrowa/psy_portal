// src/components/ui/Card.tsx
import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
                                              children,
                                              className,
                                              padding = 'md',
                                              hover = false,
                                          }) => {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div className={clsx(
            'bg-white rounded-xl border border-gray-200',
            paddings[padding],
            hover && 'hover:shadow-md transition-shadow duration-300',
            className
        )}>
            {children}
        </div>
    );
};