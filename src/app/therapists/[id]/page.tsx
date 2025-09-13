// app/therapists/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Star,
    MapPin,
    Clock,
    Calendar,
    Phone,
    Mail,
    Award,
    BookOpen,
    Users,
    MessageCircle,
    ArrowLeft,
    Lock,
    ChevronRight,
    Quote,
    CheckCircle,
    Video,
    ThumbsUp
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

interface Therapist {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        phone?: string;
    };
    specialization: string;
    approach: string;
    experience: number;
    price_per_hour: number;
    rating: number;
    review_count: number;
    bio: string;
    languages: string;
    is_online: boolean;
    next_available_slot?: string;
    created_at: string;
}

interface Review {
    id: number;
    client_name: string;
    rating: number;
    comment: string;
    date: string;
    verified: boolean;
    helpful_count: number;
}

interface AvailableSlot {
    date: string;
    time: string;
    available: boolean;
}

// Move mock reviews outside component to avoid dependency issues
const mockReviews: Review[] = [
    {
        id: 1,
        client_name: 'Мария К.',
        rating: 5,
        comment: 'Отличный специалист! Помогла разобраться с тревожностью. Очень профессиональный подход и комфортная атмосфера на сессиях.',
        date: '2024-03-15',
        verified: true,
        helpful_count: 8
    },
    {
        id: 2,
        client_name: 'Алексей В.',
        rating: 5,
        comment: 'Работаем уже полгода. Значительный прогресс в работе со страхами и паническими атаками. Рекомендую!',
        date: '2024-03-10',
        verified: true,
        helpful_count: 12
    },
    {
        id: 3,
        client_name: 'Елена С.',
        rating: 4,
        comment: 'Хороший психолог, помогает структурировать мысли. Единственный минус - иногда сессии затягиваются.',
        date: '2024-03-05',
        verified: true,
        helpful_count: 5
    }
];

const BookingModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    therapist: Therapist;
    onLoginRequired: () => void;
}> = ({ isOpen, onClose, therapist, onLoginRequired }) => {
    const { isAuthenticated } = useAuth();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl max-w-md w-full p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="h-8 w-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Требуется авторизация</h2>
                        <p className="text-gray-600">
                            Для записи на консультацию необходимо войти в систему
                        </p>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={onLoginRequired}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Войти в систему
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full text-gray-500 py-2 rounded-lg hover:text-gray-700 transition-colors"
                        >
                            Отменить
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const handleBooking = async () => {
        setLoading(true);
        // Здесь будет логика бронирования
        setTimeout(() => {
            setLoading(false);
            onClose();
            alert('Запись успешно создана! Мы отправили подтверждение на ваш email.');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-screen overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Запись на консультацию</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                </div>

                <div className="mb-6">
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {therapist.user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                            <h3 className="font-semibold text-gray-900">{therapist.user.name}</h3>
                            <p className="text-gray-600">{Math.round(therapist.price_per_hour / 100).toLocaleString()} ₽ за сессию</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Выберите дату
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {Array.from({ length: 7 }, (_, i) => {
                                const date = new Date();
                                date.setDate(date.getDate() + i);
                                const dateStr = date.toISOString().split('T')[0];
                                const isSelected = selectedDate === dateStr;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDate(dateStr)}
                                        className={`p-3 text-sm rounded-lg border ${
                                            isSelected
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-900 border-gray-300 hover:border-blue-300'
                                        }`}
                                    >
                                        <div className="font-medium">
                                            {date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                                        </div>
                                        <div className="text-xs opacity-75">
                                            {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {selectedDate && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Доступное время
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map((time) => {
                                    const isSelected = selectedTime === time;
                                    const isAvailable = Math.random() > 0.3; // Моковая логика доступности

                                    return (
                                        <button
                                            key={time}
                                            onClick={() => isAvailable && setSelectedTime(time)}
                                            disabled={!isAvailable}
                                            className={`p-3 text-sm rounded-lg border ${
                                                isSelected
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : isAvailable
                                                        ? 'bg-white text-gray-900 border-gray-300 hover:border-blue-300'
                                                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Сообщение специалисту (необязательно)
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Опишите кратко с чем хотели бы поработать..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                        />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Детали записи:</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                            <div>Специалист: {therapist.user.name}</div>
                            <div>Дата: {selectedDate && new Date(selectedDate).toLocaleDateString('ru-RU')}</div>
                            <div>Время: {selectedTime}</div>
                            <div>Стоимость: {Math.round(therapist.price_per_hour / 100).toLocaleString()} ₽</div>
                        </div>
                    </div>

                    <button
                        onClick={handleBooking}
                        disabled={!selectedDate || !selectedTime || loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {loading ? 'Оформляем запись...' : 'Подтвердить запись'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {review.client_name[0]}
                    </div>
                    <div className="ml-3">
                        <h4 className="font-semibold text-gray-900">{review.client_name}</h4>
                        <div className="flex items-center">
                            {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                            ))}
                            <span className="ml-2 text-sm text-gray-500">
                                {new Date(review.date).toLocaleDateString('ru-RU')}
                            </span>
                        </div>
                    </div>
                </div>
                {review.verified && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Подтвержден
                    </span>
                )}
            </div>

            <div className="relative mb-4">
                <Quote className="absolute -left-1 -top-1 h-5 w-5 text-gray-300" />
                <p className="text-gray-700 leading-relaxed pl-4">{review.comment}</p>
            </div>

            <div className="flex items-center justify-between">
                <button className="flex items-center text-gray-500 hover:text-gray-700">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">Полезно ({review.helpful_count})</span>
                </button>
            </div>
        </div>
    );
};

const TherapistProfilePage: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [therapist, setTherapist] = useState<Therapist | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [activeTab, setActiveTab] = useState('about');

    useEffect(() => {
        const fetchTherapist = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`${API_BASE}/therapists/${params.id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.success) {
                    setTherapist(data.data);
                    setReviews(mockReviews); // Now using mockReviews from outside the component
                } else {
                    throw new Error(data.error || 'Специалист не найден');
                }
            } catch (error) {
                console.error('Failed to fetch therapist:', error);
                setError('Не удалось загрузить информацию о специалисте');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchTherapist();
        }
    }, [params.id]); // Now only params.id is in the dependency array

    const handleLoginRequired = () => {
        // Здесь должно быть открытие модального окна логина
        alert('Открыть модальное окно входа');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16">
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-4 text-gray-600">Загружаем профиль...</span>
                </div>
            </div>
        );
    }

    if (error || !therapist) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="text-red-600 mb-4">{error}</div>
                    <button
                        onClick={() => router.back()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Назад
                    </button>
                </div>
            </div>
        );
    }

    const languages = JSON.parse(therapist.languages || '["Русский"]');
    const priceRubles = Math.round(therapist.price_per_hour / 100);

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Назад к списку
                </button>

                {/* Main Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="p-8">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                            {/* Avatar and Basic Info */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-4xl">
                                    {therapist.user.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                {therapist.is_online && (
                                    <div className="mt-4 text-center">
                                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            Онлайн сейчас
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Main Info */}
                            <div className="flex-grow">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{therapist.user.name}</h1>
                                        <p className="text-xl text-blue-600 font-medium mb-2">{therapist.specialization}</p>
                                        <p className="text-gray-600 mb-4">{therapist.approach}</p>

                                        <div className="flex items-center gap-6 mb-4">
                                            <div className="flex items-center">
                                                <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                                                <span className="font-semibold text-gray-900">{therapist.rating}</span>
                                                <span className="text-gray-500 ml-1">({therapist.review_count} отзывов)</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Award className="h-5 w-5 mr-1" />
                                                <span>{therapist.experience} лет опыта</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {languages.map((lang: string, index: number) => (
                                                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Booking Section */}
                                    <div className="mt-6 lg:mt-0 lg:ml-8 flex-shrink-0">
                                        <div className="bg-blue-50 p-6 rounded-xl">
                                            <div className="text-center mb-4">
                                                <div className="text-3xl font-bold text-gray-900">
                                                    {priceRubles.toLocaleString()} ₽
                                                </div>
                                                <div className="text-gray-600">за сессию (60 мин)</div>
                                            </div>

                                            <button
                                                onClick={() => setShowBookingModal(true)}
                                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                                            >
                                                <Calendar className="h-5 w-5 mr-2" />
                                                Записаться на консультацию
                                            </button>

                                            <div className="mt-4 text-center">
                                                <div className="flex items-center justify-center text-sm text-gray-600">
                                                    <Video className="h-4 w-4 mr-1" />
                                                    Онлайн сессия
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="border-t border-gray-200">
                        <nav className="flex px-8">
                            {[
                                { id: 'about', label: 'О специалисте', icon: BookOpen },
                                { id: 'reviews', label: `Отзывы (${reviews.length})`, icon: MessageCircle },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
                                            isActive
                                                ? 'border-blue-600 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5 mr-2" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                    {activeTab === 'about' && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">О специалисте</h2>

                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed text-lg mb-6">
                                    {therapist.bio}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Специализация</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-center text-gray-700">
                                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                                {therapist.specialization}
                                            </li>
                                            <li className="flex items-center text-gray-700">
                                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                                Индивидуальная терапия
                                            </li>
                                            <li className="flex items-center text-gray-700">
                                                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                                Онлайн консультации
                                            </li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Подход к работе</h3>
                                        <p className="text-gray-700">
                                            {therapist.approach} - современный эффективный подход для решения широкого спектра психологических проблем.
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Формат работы</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center text-gray-700">
                                            <Video className="h-5 w-5 text-blue-600 mr-3" />
                                            <span>Индивидуальные онлайн сессии</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <Clock className="h-5 w-5 text-blue-600 mr-3" />
                                            <span>Продолжительность сессии: 60 минут</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                                            <span>Гибкое расписание, включая вечерние часы</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Отзывы клиентов</h2>
                                    <div className="flex items-center">
                                        <Star className="h-6 w-6 text-yellow-400 fill-current mr-2" />
                                        <span className="text-xl font-bold text-gray-900">{therapist.rating}</span>
                                        <span className="text-gray-500 ml-2">из 5</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {reviews.map((review) => (
                                        <ReviewCard key={review.id} review={review} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={showBookingModal}
                onClose={() => setShowBookingModal(false)}
                therapist={therapist}
                onLoginRequired={handleLoginRequired}
            />
        </div>
    );
};

export default TherapistProfilePage;