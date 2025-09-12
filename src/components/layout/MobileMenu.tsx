// src/components/layout/MobileMenu.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    navigation: Array<{
        name: string;
        href: string;
        icon: React.ComponentType<{ className?: string }>;
    }>;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, navigation }) => {
    const pathname = usePathname();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

            <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="text-xl font-bold text-blue-600">PsyPortal</div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <nav className="mt-5 px-2 space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onClose}
                                className={clsx(
                                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                                    isActive
                                        ? 'bg-blue-100 text-blue-900'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                            >
                                <Icon
                                    className={clsx(
                                        'mr-3 flex-shrink-0 h-5 w-5',
                                        isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                                    )}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};