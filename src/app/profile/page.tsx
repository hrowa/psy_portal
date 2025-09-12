'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Phone, Calendar, Shield } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <p className="text-gray-500">Необходимо войти в систему</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-2xl">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-6">
                            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                            <p className="text-gray-600 capitalize">{user.role}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>

                            {user.phone && (
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500">Телефон</p>
                                        <p className="font-medium">{user.phone}</p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center">
                                <User className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Роль</p>
                                    <p className="font-medium capitalize">{user.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Дата регистрации</p>
                                    <p className="font-medium">
                                        {new Date(user.created_at).toLocaleDateString('ru-RU')}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Shield className="h-5 w-5 text-gray-400 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Email подтвержден</p>
                                    <p className="font-medium">
                                        {user.is_email_verified ? (
                                            <span className="text-green-600">Да</span>
                                        ) : (
                                            <span className="text-red-600">Нет</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {user.last_login_at && (
                                <div className="flex items-center">
                                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="text-sm text-gray-500">Последний вход</p>
                                        <p className="font-medium">
                                            {new Date(user.last_login_at).toLocaleString('ru-RU')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-200">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Редактировать профиль
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;