//app/dashboard/page.tsx

"use client"
import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, User, Settings, CreditCard, FileText,
    Video, MessageCircle, Star, Bell, ChevronRight, Play,
    CheckCircle, XCircle, AlertCircle, Edit3, Download
} from 'lucide-react';

// Mock data for demonstration
const mockUser = {
    id: 1,
    name: "Анна Петрова",
    email: "anna.petrova@email.com",
    phone: "+7 (999) 123-45-67",
    avatar: null,
    memberSince: "2024-01-15",
    totalSessions: 12,
    upcomingSessions: 2
};

const mockSessions = [
    {
        id: 1,
        therapist: {
            name: "Анна Смирнова",
            specialization: "Тревожные расстройства"
        },
        date: "2024-09-12",
        time: "14:00",
        status: "scheduled",
        price: 3150,
        type: "individual",
        duration: 50,
        notes: "Работа с паническими атаками"
    },
    {
        id: 2,
        therapist: {
            name: "Михаил Петров",
            specialization: "Семейная терапия"
        },
        date: "2024-09-10",
        time: "16:00",
        status: "completed",
        price: 4200,
        type: "couple",
        duration: 50,
        rating: 5,
        notes: "Семейные отношения"
    },
    {
        id: 3,
        therapist: {
            name: "Анна Смирнова",
            specialization: "Тревожные расстройства"
        },
        date: "2024-09-05",
        time: "14:00",
        status: "completed",
        price: 3150,
        type: "individual",
        duration: 50,
        rating: 5,
        notes: "Работа с тревожностью"
    },
    {
        id: 4,
        therapist: {
            name: "Елена Волкова",
            specialization: "Детская психология"
        },
        date: "2024-09-15",
        time: "10:00",
        status: "cancelled",
        price: 2800,
        type: "individual",
        duration: 50,
        notes: "Отменено клиентом"
    }
];

const mockNotifications = [
    {
        id: 1,
        type: "session_reminder",
        title: "Напоминание о сессии",
        message: "Сессия с Анной Смирновой завтра в 14:00",
        date: "2024-09-11",
        read: false
    },
    {
        id: 2,
        type: "session_completed",
        title: "Сессия завершена",
        message: "Оцените вашу сессию с Михаилом Петровым",
        date: "2024-09-10",
        read: false
    },
    {
        id: 3,
        type: "payment_success",
        title: "Платеж успешен",
        message: "Оплата за сессию прошла успешно",
        date: "2024-09-09",
        read: true
    }
];

// Components
const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
            <div className={`p-3 bg-${color}-100 rounded-full`}>
                <Icon className={`h-6 w-6 text-${color}-600`} />
            </div>
        </div>
    </div>
);

const SessionCard = ({ session, onJoinSession, onCancelSession, onRateSession }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'text-blue-600 bg-blue-100';
            case 'completed': return 'text-green-600 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'scheduled': return 'Запланирована';
            case 'completed': return 'Завершена';
            case 'cancelled': return 'Отменена';
            default: return 'Неизвестно';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'scheduled': return Clock;
            case 'completed': return CheckCircle;
            case 'cancelled': return XCircle;
            default: return AlertCircle;
        }
    };

    const StatusIcon = getStatusIcon(session.status);
    const sessionDate = new Date(`${session.date}T${session.time}`);
    const isUpcoming = sessionDate > new Date() && session.status === 'scheduled';
    const canJoin = isUpcoming && sessionDate - new Date() < 15 * 60 * 1000; // 15 minutes before

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        <h3 className="font-semibold text-gray-900">{session.therapist.name}</h3>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusColor(session.status)}`}>
              <StatusIcon className="inline h-3 w-3 mr-1" />
                            {getStatusText(session.status)}
            </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{session.therapist.specialization}</p>
                    <p className="text-sm text-gray-500">{session.notes}</p>
                </div>
                <div className="text-right">
                    <div className="font-semibold text-gray-900">{session.price.toLocaleString()} ₽</div>
                    <div className="text-sm text-gray-500">{session.duration} мин</div>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(session.date).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}
                </div>
                <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {session.time}
                </div>
                <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {session.type === 'individual' ? 'Индивидуальная' : 'Парная'}
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
                {canJoin && (
                    <button
                        onClick={() => onJoinSession(session)}
                        className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                        <Video className="h-4 w-4 mr-2" />
                        Присоединиться
                    </button>
                )}

                {isUpcoming && !canJoin && (
                    <button
                        onClick={() => onCancelSession(session)}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Отменить
                    </button>
                )}

                {session.status === 'completed' && !session.rating && (
                    <button
                        onClick={() => onRateSession(session)}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                        <Star className="h-4 w-4 mr-2" />
                        Оценить
                    </button>
                )}

                {session.status === 'completed' && session.rating && (
                    <div className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
                        <Star className="h-4 w-4 mr-2 text-yellow-400 fill-current" />
                        Оценено: {session.rating}/5
                    </div>
                )}

                <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

const NotificationItem = ({ notification, onMarkRead }) => (
    <div className={`p-4 border-l-4 ${notification.read ? 'border-gray-200 bg-gray-50' : 'border-blue-400 bg-blue-50'} rounded-r-lg`}>
        <div className="flex justify-between items-start">
            <div className="flex-1">
                <h4 className={`font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                    {notification.title}
                </h4>
                <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'} mt-1`}>
                    {notification.message}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.date).toLocaleDateString('ru-RU')}
                </p>
            </div>
            {!notification.read && (
                <button
                    onClick={() => onMarkRead(notification.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    Отметить как прочитанное
                </button>
            )}
        </div>
    </div>
);

// Main Dashboard Component
const ClientDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState(mockUser);
    const [sessions, setSessions] = useState(mockSessions);
    const [notifications, setNotifications] = useState(mockNotifications);

    // Filter sessions
    const upcomingSessions = sessions.filter(s => s.status === 'scheduled');
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const unreadNotifications = notifications.filter(n => !n.read);

    // Event handlers
    const handleJoinSession = (session) => {
        alert(`Подключение к сессии с ${session.therapist.name}...`);
        // Here you would open the video call interface
    };

    const handleCancelSession = (session) => {
        if (confirm('Вы уверены, что хотите отменить эту сессию?')) {
            setSessions(prev => prev.map(s =>
                s.id === session.id ? { ...s, status: 'cancelled' } : s
            ));
        }
    };

    const handleRateSession = (session) => {
        const rating = prompt('Оцените сессию от 1 до 5:');
        if (rating && parseInt(rating) >= 1 && parseInt(rating) <= 5) {
            setSessions(prev => prev.map(s =>
                s.id === session.id ? { ...s, rating: parseInt(rating) } : s
            ));
        }
    };

    const handleMarkNotificationRead = (notificationId) => {
        setNotifications(prev => prev.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Личный кабинет</h1>
                            <p className="text-gray-600">Добро пожаловать, {user.name}!</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-400 hover:text-gray-500">
                                <Bell className="h-6 w-6" />
                                {unreadNotifications.length > 0 && (
                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                                )}
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-500">
                                <Settings className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="border-t border-gray-200">
                        <nav className="flex space-x-8">
                            {[
                                { id: 'overview', label: 'Обзор', icon: Calendar },
                                { id: 'sessions', label: 'Мои сессии', icon: Video },
                                { id: 'notifications', label: 'Уведомления', icon: Bell },
                                { id: 'profile', label: 'Профиль', icon: User },
                                { id: 'billing', label: 'Платежи', icon: CreditCard }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4 mr-2" />
                                        {tab.label}
                                        {tab.id === 'notifications' && unreadNotifications.length > 0 && (
                                            <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotifications.length}
                      </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                icon={Calendar}
                                title="Запланированные сессии"
                                value={upcomingSessions.length}
                                subtitle="на этой неделе"
                                color="blue"
                            />
                            <StatCard
                                icon={CheckCircle}
                                title="Завершенные сессии"
                                value={completedSessions.length}
                                subtitle="всего"
                                color="green"
                            />
                            <StatCard
                                icon={Bell}
                                title="Непрочитанные"
                                value={unreadNotifications.length}
                                subtitle="уведомлений"
                                color="yellow"
                            />
                        </div>

                        {/* Upcoming Sessions */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Ближайшие сессии</h2>
                                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                                    Смотреть все
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>

                            {upcomingSessions.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingSessions.slice(0, 2).map((session) => (
                                        <SessionCard
                                            key={session.id}
                                            session={session}
                                            onJoinSession={handleJoinSession}
                                            onCancelSession={handleCancelSession}
                                            onRateSession={handleRateSession}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
                                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Нет запланированных сессий</h3>
                                    <p className="text-gray-600 mb-4">Запишитесь к психологу, чтобы начать работу</p>
                                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        Найти психолога
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Recent Notifications */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900">Последние уведомления</h2>
                                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                                    Смотреть все
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {notifications.slice(0, 3).map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkRead={handleMarkNotificationRead}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Sessions Tab */}
                {activeTab === 'sessions' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Все сессии</h2>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Записаться к психологу
                            </button>
                        </div>

                        <div className="space-y-4">
                            {sessions.map((session) => (
                                <SessionCard
                                    key={session.id}
                                    session={session}
                                    onJoinSession={handleJoinSession}
                                    onCancelSession={handleCancelSession}
                                    onRateSession={handleRateSession}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Уведомления</h2>
                            <button
                                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Отметить все как прочитанные
                            </button>
                        </div>

                        <div className="space-y-3">
                            {notifications.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkRead={handleMarkNotificationRead}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="max-w-2xl">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Настройки профиля</h2>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center mb-6">
                                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                                    <User className="h-8 w-8 text-gray-500" />
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                                    <p className="text-gray-600">Клиент с {new Date(user.memberSince).toLocaleDateString('ru-RU')}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                                    <input
                                        type="text"
                                        value={user.name}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                                    <input
                                        type="tel"
                                        value={user.phone}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Сохранить изменения
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">История платежей</h2>

                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-gray-900">Последние транзакции</h3>
                                    <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                                        <Download className="h-4 w-4 mr-1" />
                                        Скачать отчет
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Дата
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Описание
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Психолог
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Сумма
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Статус
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {completedSessions.map((session) => (
                                        <tr key={session.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(session.date).toLocaleDateString('ru-RU')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                Сессия психотерапии
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {session.therapist.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {session.price.toLocaleString()} ₽
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Оплачено
                          </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;