// src/components/layout/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Calendar,
    Video,
    Bell,
    User,
    CreditCard,
    Settings,
    Home,
    MessageCircle
} from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
    className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
    const pathname = usePathname();

    const navigation = [
        {
            name: 'Обзор',
            href: '/dashboard',
            icon: Home,
        },
        {
            name: 'Мои сессии',
            href: '/dashboard/sessions',
            icon: Video,
        },
        {
            name: 'Расписание',
            href: '/dashboard/schedule',
            icon: Calendar,
        },
        {
            name: 'Сообщения',
            href: '/dashboard/messages',
            icon: MessageCircle,
        },
        {
            name: 'Уведомления',
            href: '/dashboard/notifications',
            icon: Bell,
        },
        {
            name: 'Профиль',
            href: '/dashboard/profile',
            icon: User,
        },
        {
            name: 'Платежи',
            href: '/dashboard/billing',
            icon: CreditCard,
        },
        {
            name: 'Настройки',
            href: '/dashboard/settings',
            icon: Settings,
        },
    ];

    return (
        <div className={clsx('flex flex-col w-64 bg-white border-r border-gray-200', className)}>
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                <nav className="mt-5 flex-1 px-2 space-y-1">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
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
