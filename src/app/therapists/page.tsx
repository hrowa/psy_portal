// app/therapists/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Search, Star, Filter, Users, ChevronRight, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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

interface TherapistsResponse {
    therapists: Therapist[];
    total: number;
    page: number;
    per_page: number;
}

const TherapistCard: React.FC<{ therapist: Therapist; onLoginRequired: () => void }> = ({
                                                                                            therapist,
                                                                                            onLoginRequired
                                                                                        }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const languages = JSON.parse(therapist.languages || '["Русский"]');
    const priceRubles = Math.round(therapist.price_per_hour / 100);

    const handleBookSession = (e: React.MouseEvent) => {
        e.stopPropagation(); // Предотвращаем переход в профиль при клике на кнопку
        if (isAuthenticated) {
            // Логика записи на сессию для авторизованных пользователей
            console.log('Запись к психологу:', therapist.user.name);
            // Здесь будет переход на страницу бронирования
        } else {
            // Показать модальное окно входа для неавторизованных пользователей
            onLoginRequired();
        }
    };

    const handleCardClick = () => {
        router.push(`/therapists/${therapist.id}`);
    };

    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                        {therapist.user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                            {therapist.user.name}
                        </h3>
                        <p className="text-sm text-gray-500">{therapist.experience} лет опыта</p>
                        <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">{therapist.rating}</span>
                            <span className="ml-1 text-sm text-gray-500">({therapist.review_count} отзывов)</span>
                        </div>
                    </div>
                </div>
                {therapist.is_online && (
                    <div className="flex flex-col items-end">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-medium">
                            Онлайн
                        </span>
                        <span className="text-xs text-gray-500 mt-1">Доступен сейчас</span>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <div className="flex items-center mb-2">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    <p className="font-medium text-gray-900">{therapist.specialization}</p>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                    <strong>Подход:</strong> {therapist.approach}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{therapist.bio}</p>
                {/* Добавляем подсказку для перехода в профиль */}
                <p className="text-xs text-blue-600 mt-2 hover:underline">
                    Нажмите для подробной информации
                </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {languages.map((lang: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {lang}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                    <div className="text-2xl font-bold text-gray-900">
                        {priceRubles.toLocaleString()} ₽
                    </div>
                    <div className="text-sm text-gray-500">за сессию</div>
                </div>

                {isAuthenticated ? (
                    <button
                        onClick={handleBookSession}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
                    >
                        Записаться
                        <ChevronRight className="ml-2 h-4 w-4" />
                    </button>
                ) : (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onLoginRequired();
                        }}
                        className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center font-medium border-2 border-dashed border-gray-300"
                        title="Необходим вход в систему"
                    >
                        <Lock className="mr-2 h-4 w-4" />
                        Войти для записи
                    </button>
                )}
            </div>
        </div>
    );
};

const LoginPromptModal: React.FC<{ isOpen: boolean; onClose: () => void; onLogin: () => void; onRegister: () => void }> = ({
                                                                                                                               isOpen,
                                                                                                                               onClose,
                                                                                                                               onLogin,
                                                                                                                               onRegister
                                                                                                                           }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Требуется авторизация</h2>
                    <p className="text-gray-600">
                        Для записи на консультацию необходимо войти в систему или зарегистрироваться
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onLogin}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Войти в систему
                    </button>

                    <button
                        onClick={onRegister}
                        className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                    >
                        Зарегистрироваться
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
};

const TherapistsPage: React.FC = () => {
    const [therapists, setTherapists] = useState<TherapistsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const [filters, setFilters] = useState({
        specialization: '',
        approach: '',
        minExperience: '',
        maxPrice: '',
        onlineOnly: false,
    });
    const [currentPage, setCurrentPage] = useState(1);

    // Use useCallback to memoize fetchTherapists and prevent infinite re-renders
    const fetchTherapists = useCallback(async (page: number = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('per_page', '12');

            if (filters.specialization) params.append('specialization', filters.specialization);
            if (filters.approach) params.append('approach', filters.approach);
            if (filters.minExperience) params.append('min_experience', filters.minExperience);
            if (filters.maxPrice) params.append('max_price', filters.maxPrice);
            if (filters.onlineOnly) params.append('online_only', 'true');

            const response = await fetch(`${API_BASE}/therapists?${params}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                setTherapists(data.data);
            } else {
                throw new Error(data.error || 'Ошибка при загрузке данных');
            }
        } catch (error) {
            console.error('Failed to fetch therapists:', error);
            setError('Не удалось загрузить список психологов. Проверьте подключение к серверу.');
        } finally {
            setLoading(false);
        }
    }, [filters]); // Only include filters in dependency array

    // Получение функций для открытия модальных окон из контекста или пропсов
    // Для демонстрации используем простые alert'ы
    const handleOpenLogin = () => {
        setShowLoginPrompt(false);
        // Здесь должно быть открытие модального окна логина
        alert('Открыть модальное окно входа');
    };

    const handleOpenRegister = () => {
        setShowLoginPrompt(false);
        // Здесь должно быть открытие модального окна регистрации
        alert('Открыть модальное окно регистрации');
    };

    // Now fetchTherapists is stable and can be safely used in useEffect
    useEffect(() => {
        fetchTherapists(currentPage);
    }, [currentPage, fetchTherapists]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchTherapists(1);
    };

    const handleFilterChange = (key: string, value: string | boolean) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleLoginRequired = () => {
        setShowLoginPrompt(true);
    };

    const totalPages = therapists ? Math.ceil(therapists.total / therapists.per_page) : 0;

    if (loading && !therapists) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16">
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-4 text-gray-600">Загружаем психологов...</span>
                </div>
            </div>
        );
    }

    if (error && !therapists) {
        return (
            <div className="min-h-screen bg-gray-50 pt-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="text-red-600 mb-4">{error}</div>
                    <button
                        onClick={() => fetchTherapists()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Найдите своего психолога
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            {therapists?.total || 0} проверенных специалистов готовы помочь вам
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Поиск по специализации, подходу или имени..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-32 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Найти
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center mb-4">
                                <Filter className="h-5 w-5 text-gray-600 mr-2" />
                                <h2 className="text-lg font-semibold text-gray-900">Фильтры</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Специализация
                                    </label>
                                    <select
                                        value={filters.specialization}
                                        onChange={(e) => handleFilterChange('specialization', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Все специализации</option>
                                        <option value="тревожные">Тревожные расстройства</option>
                                        <option value="семейная">Семейная терапия</option>
                                        <option value="детская">Детская психология</option>
                                        <option value="зависимости">Зависимости</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Подход
                                    </label>
                                    <select
                                        value={filters.approach}
                                        onChange={(e) => handleFilterChange('approach', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Любой подход</option>
                                        <option value="когнитивно">Когнитивно-поведенческая</option>
                                        <option value="системная">Системная терапия</option>
                                        <option value="игровая">Игровая терапия</option>
                                        <option value="12-шагов">12-шаговая программа</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Минимальный опыт (лет)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={filters.minExperience}
                                        onChange={(e) => handleFilterChange('minExperience', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Любой"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Максимальная цена (₽)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Любая"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="onlineOnly"
                                        checked={filters.onlineOnly}
                                        onChange={(e) => handleFilterChange('onlineOnly', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="onlineOnly" className="ml-2 text-sm text-gray-700">
                                        Только онлайн сейчас
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {loading && therapists && (
                            <div className="mb-4 text-center text-gray-600">
                                <div className="animate-spin inline-block h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                Обновляем список...
                            </div>
                        )}

                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <Users className="h-5 w-5 text-gray-600 mr-2" />
                                <span className="text-gray-900 font-medium">
                                    Найдено {therapists?.total || 0} психологов
                                </span>
                            </div>
                            <div className="text-sm text-gray-500">
                                Страница {currentPage} из {totalPages}
                            </div>
                        </div>

                        {/* Therapists Grid */}
                        {therapists?.therapists && therapists.therapists.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                {therapists.therapists.map((therapist) => (
                                    <TherapistCard
                                        key={therapist.id}
                                        therapist={therapist}
                                        onLoginRequired={handleLoginRequired}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 mb-2">
                                    Психологи не найдены
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Попробуйте изменить параметры поиска или фильтры
                                </p>
                                <button
                                    onClick={() => {
                                        setFilters({
                                            specialization: '',
                                            approach: '',
                                            minExperience: '',
                                            maxPrice: '',
                                            onlineOnly: false,
                                        });
                                        setSearchQuery('');
                                    }}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Сбросить фильтры
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Предыдущая
                                </button>

                                {[...Array(totalPages)].map((_, i) => {
                                    const page = i + 1;
                                    const isActive = page === currentPage;
                                    const shouldShow = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2;

                                    if (!shouldShow) {
                                        if (page === currentPage - 3 || page === currentPage + 3) {
                                            return <span key={page} className="px-2 text-gray-400">...</span>;
                                        }
                                        return null;
                                    }

                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-lg ${
                                                isActive
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Следующая
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Login Prompt Modal */}
            <LoginPromptModal
                isOpen={showLoginPrompt}
                onClose={() => setShowLoginPrompt(false)}
                onLogin={handleOpenLogin}
                onRegister={handleOpenRegister}
            />
        </div>
    );
};

export default TherapistsPage;