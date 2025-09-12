// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Star, Users, Clock, Shield, Video, MessageCircle, Heart, Award, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE = 'http://localhost:8080/api/v1';

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
}

interface Stats {
    total_therapists: number;
    total_sessions: number;
    active_therapists: number;
    average_rating: number;
}

const api = {
    fetchStats: async (): Promise<Stats | null> => {
        try {
            const response = await fetch(`${API_BASE}/stats`);
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Failed to fetch stats:', error);
            return null;
        }
    },

    fetchTherapists: async (filters = {}): Promise<{ therapists: Therapist[] } | null> => {
        try {
            const params = new URLSearchParams();
            params.append('page', '1');
            params.append('per_page', '6');
            if ((filters as any).online_only) params.append('online_only', 'true');

            const response = await fetch(`${API_BASE}/therapists?${params}`);
            const data = await response.json();
            return data.success ? data.data : null;
        } catch (error) {
            console.error('Failed to fetch therapists:', error);
            return null;
        }
    },
};

// Hero Component
const Hero: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/therapists?search=${encodeURIComponent(searchQuery)}`);
    };

    const handleCategoryClick = (category: string) => {
        router.push(`/therapists?specialization=${encodeURIComponent(category)}`);
    };

    return (
        <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Найдите своего
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}психолога{" "}
            </span>
                        онлайн
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Профессиональная психологическая помощь в удобном формате.
                        Более 4000 проверенных специалистов готовы помочь вам прямо сейчас.
                    </p>

                    <div className="max-w-2xl mx-auto mb-8">
                        <form onSubmit={handleSearchSubmit} className="relative">
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

                    <div className="flex flex-wrap justify-center gap-3">
                        {['Тревожность', 'Депрессия', 'Отношения', 'Самооценка', 'Стресс'].map((category) => (
                            <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-colors"
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Stats Section Component
const StatsSection: React.FC<{ stats: Stats | null }> = ({ stats }) => {
    if (!stats) return null;

    const statItems = [
        { label: 'Психологов', value: stats.total_therapists?.toLocaleString() || '4000+', icon: Users },
        { label: 'Проведенных сессий', value: stats.total_sessions?.toLocaleString() || '2.9M+', icon: Video },
        { label: 'Онлайн сейчас', value: stats.active_therapists?.toLocaleString() || '120+', icon: Clock },
        { label: 'Средний рейтинг', value: stats.average_rating?.toFixed(1) || '4.8', icon: Star },
    ];

    return (
        <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {statItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={index} className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <Icon className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">{item.value}</div>
                                <div className="text-gray-600">{item.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Therapist Card Component
const TherapistCard: React.FC<{ therapist: Therapist }> = ({ therapist }) => {
    const { isAuthenticated } = useAuth();
    const languages = JSON.parse(therapist.languages || '["Русский"]');
    const priceRubles = Math.round(therapist.price_per_hour / 100);

    const handleBookSession = () => {
        if (isAuthenticated) {
            console.log('Запись к психологу:', therapist.user.name);
            // Здесь будет логика записи на сессию
        } else {
            alert('Для записи необходимо войти в систему');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {therapist.user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">{therapist.user.name}</h3>
                        <p className="text-sm text-gray-500">{therapist.experience} лет опыта</p>
                    </div>
                </div>
                {therapist.is_online && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Онлайн
          </span>
                )}
            </div>

            <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 mb-1">{therapist.specialization}</p>
                <p className="text-sm text-gray-600 mb-2">{therapist.approach}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{therapist.bio}</p>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{therapist.rating}</span>
                    <span className="ml-1 text-sm text-gray-500">({therapist.review_count})</span>
                </div>
                <div className="flex gap-1">
                    {languages.slice(0, 2).map((lang: string, index: number) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
              {lang}
            </span>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-900">
                    {priceRubles.toLocaleString()} ₽
                    <span className="text-sm font-normal text-gray-500">/сессия</span>
                </div>
                <button
                    onClick={handleBookSession}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                    Записаться
                    <ChevronRight className="ml-1 h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

// Featured Therapists Component
const FeaturedTherapists: React.FC<{ therapists: { therapists: Therapist[] } | null }> = ({ therapists }) => {
    if (!therapists?.therapists) return null;

    return (
        <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Рекомендуемые психологи
                    </h2>
                    <p className="text-lg text-gray-600">
                        Специалисты с высоким рейтингом и подтвержденным опытом
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {therapists.therapists.slice(0, 6).map((therapist) => (
                        <TherapistCard key={therapist.id} therapist={therapist} />
                    ))}
                </div>

                <div className="text-center">
                    <Link
                        href="/therapists"
                        className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Смотреть всех психологов
                    </Link>
                </div>
            </div>
        </div>
    );
};

// Features Component
const Features: React.FC = () => {
    const features = [
        {
            icon: Shield,
            title: 'Безопасность и конфиденциальность',
            description: 'Все сессии проходят через защищенное соединение. Полная анонимность гарантирована.'
        },
        {
            icon: Video,
            title: 'Удобный видеочат',
            description: 'Качественная видеосвязь прямо в браузере. Никаких дополнительных программ.'
        },
        {
            icon: Clock,
            title: 'Гибкое расписание',
            description: 'Записывайтесь на удобное время. Много специалистов доступны 24/7.'
        },
        {
            icon: Award,
            title: 'Проверенные специалисты',
            description: 'Все психологи проходят строгий отбор и имеют профильное образование.'
        },
        {
            icon: Heart,
            title: 'Индивидуальный подход',
            description: 'Подберем специалиста именно под ваш запрос и особенности.'
        },
        {
            icon: MessageCircle,
            title: 'Поддержка 24/7',
            description: 'Наша служба поддержки всегда готова помочь с любыми вопросами.'
        }
    ];

    return (
        <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Почему выбирают нас
                    </h2>
                    <p className="text-lg text-gray-600">
                        Современная платформа для качественной психологической помощи
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <Icon className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Call to Action Component
const CallToAction: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                    Готовы начать путь к лучшей версии себя?
                </h2>
                <p className="text-xl text-blue-100 mb-8">
                    Запишитесь на первую консультацию уже сегодня
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/therapists"
                                className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                            >
                                Найти психолога
                            </Link>
                            <Link
                                href="/sessions"
                                className="inline-block px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
                            >
                                Мои записи
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/therapists"
                                className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                            >
                                Начать сейчас
                            </Link>
                            <Link
                                href="/how-it-works"
                                className="inline-block px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold"
                            >
                                Узнать больше
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main Home Page Component
const HomePage: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [therapists, setTherapists] = useState<{ therapists: Therapist[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsData, therapistsData] = await Promise.all([
                    api.fetchStats(),
                    api.fetchTherapists({ online_only: true })
                ]);

                setStats(statsData);
                setTherapists(therapistsData);
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Hero />
            <StatsSection stats={stats} />
            <FeaturedTherapists therapists={therapists} />
            <Features />
            <CallToAction />
        </div>
    );
};

export default HomePage;