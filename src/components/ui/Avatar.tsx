// src/components/ui/Avatar.tsx
import React from 'react';
import { User } from 'lucide-react';
import { clsx } from 'clsx';

interface AvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
                                                  src,
                                                  alt,
                                                  name,
                                                  size = 'md',
                                                  className,
                                              }) => {
    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-base',
        xl: 'w-24 h-24 text-xl'
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    if (src) {
        return (
            <img
                src={src}
                alt={alt || name}
                className={clsx(
                    'rounded-full object-cover',
                    sizes[size],
                    className
                )}
            />
        );
    }

    return (
        <div className={clsx(
            'rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold',
            sizes[size],
            className
        )}>
            {name ? getInitials(name) : <User className="w-1/2 h-1/2" />}
        </div>
    );
};