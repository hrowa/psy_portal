// app/components/layout/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                <span className="hidden md:block">{user?.name}</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="font-medium text-gray-900">{user?.name}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                            <p className="text-xs text-blue-600 capitalize">{user?.role}</p>
                        </div>

                        <Link
                            href="/profile"
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center"
                            onClick={() => setIsOpen(false)}
                        >
                            <User className="h-4 w-4 mr-2" />
                            Профиль
                        </Link>

                        <Link
                            href="/settings"
                            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 flex items-center"
                            onClick={() => setIsOpen(false)}
                        >
                            <Settings className="h-4 w-4 mr-2" />
                            Настройки
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Выйти
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

interface HeaderProps {
    onOpenLogin: () => void;
    onOpenRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenLogin, onOpenRegister }) => {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();

    const navItems = [
        { href: '/therapists', label: 'Психологи' },
        { href: '/how-it-works', label: 'Как это работает' },
        { href: '/reviews', label: 'Отзывы' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            PsyPortal
                        </Link>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`transition-colors ${
                                    pathname === item.href
                                        ? 'text-blue-600 font-medium'
                                        : 'text-gray-700 hover:text-blue-600'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <UserMenu />
                        ) : (
                            <>
                                <button
                                    onClick={onOpenLogin}
                                    className="text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    Войти
                                </button>
                                <button
                                    onClick={onOpenRegister}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Стать психологом
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

// // src/components/layout/Header.tsx
// import React, { useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import { Bell, Menu, X, User, Settings, LogOut } from 'lucide-react';
// import { Button } from '@/components/ui';
// import { useAuth, useNotifications } from '@/lib/hooks';
// import { Avatar } from '@/components/ui';
//
// export const Header: React.FC = () => {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [isProfileOpen, setIsProfileOpen] = useState(false);
//     const { user, isAuthenticated, logout } = useAuth();
//     const { unreadCount } = useNotifications();
//     const router = useRouter();
//
//     const navigation = [
//         { name: 'Психологи', href: '/therapists' },
//         { name: 'Как это работает', href: '/how-it-works' },
//         { name: 'О нас', href: '/about' },
//         { name: 'Блог', href: '/blog' },
//     ];
//
//     const handleLogout = async () => {
//         await logout();
//         router.push('/');
//     };
//
//     return (
//         <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <div className="flex justify-between items-center h-16">
//                     {/* Logo */}
//                     <div className="flex items-center">
//                         <Link href="/" className="text-2xl font-bold text-blue-600">
//                             PsyPortal
//                         </Link>
//                     </div>
//
//                     {/* Desktop Navigation */}
//                     <nav className="hidden md:flex space-x-8">
//                         {navigation.map((item) => (
//                             <Link
//                                 key={item.name}
//                                 href={item.href}
//                                 className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
//                             >
//                                 {item.name}
//                             </Link>
//                         ))}
//                     </nav>
//
//                     {/* Right side */}
//                     <div className="flex items-center space-x-4">
//                         {isAuthenticated ? (
//                             <>
//                                 {/* Notifications */}
//                                 <div className="relative">
//                                     <Link
//                                         href="/dashboard/notifications"
//                                         className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
//                                     >
//                                         <Bell className="h-6 w-6" />
//                                         {unreadCount > 0 && (
//                                             <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
//                                         )}
//                                     </Link>
//                                 </div>
//
//                                 {/* Profile Dropdown */}
//                                 <div className="relative">
//                                     <button
//                                         onClick={() => setIsProfileOpen(!isProfileOpen)}
//                                         className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
//                                     >
//                                         <Avatar name={user?.name} size="sm" />
//                                         <span className="hidden md:block font-medium">{user?.name}</span>
//                                     </button>
//
//                                     {isProfileOpen && (
//                                         <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
//                                             <Link
//                                                 href="/dashboard"
//                                                 className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                                 onClick={() => setIsProfileOpen(false)}
//                                             >
//                                                 <User className="h-4 w-4 mr-2" />
//                                                 Личный кабинет
//                                             </Link>
//                                             <Link
//                                                 href="/dashboard/profile"
//                                                 className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                                 onClick={() => setIsProfileOpen(false)}
//                                             >
//                                                 <Settings className="h-4 w-4 mr-2" />
//                                                 Настройки
//                                             </Link>
//                                             <hr className="my-1" />
//                                             <button
//                                                 onClick={handleLogout}
//                                                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                                             >
//                                                 <LogOut className="h-4 w-4 mr-2" />
//                                                 Выйти
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             </>
//                         ) : (
//                             <>
//                                 <Link
//                                     href="/auth/signin"
//                                     className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
//                                 >
//                                     Войти
//                                 </Link>
//                                 <Button size="sm">
//                                     <Link href="/auth/signup">Стать психологом</Link>
//                                 </Button>
//                             </>
//                         )}
//
//                         {/* Mobile menu button */}
//                         <button
//                             onClick={() => setIsMenuOpen(!isMenuOpen)}
//                             className="md:hidden p-2 text-gray-400 hover:text-gray-500"
//                         >
//                             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* Mobile Navigation */}
//                 {isMenuOpen && (
//                     <div className="md:hidden py-4 border-t border-gray-200">
//                         <div className="space-y-2">
//                             {navigation.map((item) => (
//                                 <Link
//                                     key={item.name}
//                                     href={item.href}
//                                     className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
//                                     onClick={() => setIsMenuOpen(false)}
//                                 >
//                                     {item.name}
//                                 </Link>
//                             ))}
//
//                             {!isAuthenticated && (
//                                 <>
//                                     <Link
//                                         href="/auth/signin"
//                                         className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
//                                         onClick={() => setIsMenuOpen(false)}
//                                     >
//                                         Войти
//                                     </Link>
//                                     <Link
//                                         href="/auth/signup"
//                                         className="block px-3 py-2 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
//                                         onClick={() => setIsMenuOpen(false)}
//                                     >
//                                         Стать психологом
//                                     </Link>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </header>
//     );
// };