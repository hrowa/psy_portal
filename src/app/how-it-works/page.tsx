// "use client"
// import React, { useState } from 'react';
// import {
//     Heart, Shield, Users, Award, CheckCircle, Play,
//     Calendar, Video, MessageCircle, Star, ArrowRight,
//     Clock, Lock, Headphones, FileText, CreditCard
// } from 'lucide-react';
//
// // About Us Page Component
// const AboutUsPage = () => {
//     const team = [
//         {
//             name: "Анна Михайлова",
//             role: "Основатель и CEO",
//             bio: "Клинический психолог с 15-летним опытом. Основала PsyPortal с миссией сделать психологическую помощь доступной каждому.",
//             image: "AM"
//         },
//         {
//             name: "Дмитрий Соколов",
//             role: "Главный врач",
//             bio: "Психиатр и психотерапевт, супервизор. Отвечает за качество и стандарты психологической помощи на платформе.",
//             image: "ДС"
//         },
//         {
//             name: "Елена Волкова",
//             role: "Директор по развитию",
//             bio: "Специалист по психологии развития. Курирует образовательные программы и развитие специалистов.",
//             image: "ЕВ"
//         },
//         {
//             name: "Михаил Петров",
//             role: "CTO",
//             bio: "Технический директор с опытом в медицинских IT-решениях. Обеспечивает безопасность и надежность платформы.",
//             image: "МП"
//         }
//     ];
//
//     const values = [
//         {
//             icon: Heart,
//             title: "Забота о людях",
//             description: "Каждый человек заслуживает качественной психологической поддержки и понимания."
//         },
//         {
//             icon: Shield,
//             title: "Конфиденциальность",
//             description: "Абсолютная конфиденциальность и защита персональных данных наших клиентов."
//         },
//         {
//             icon: Award,
//             title: "Профессионализм",
//             description: "Только проверенные специалисты с подтвержденным образованием и опытом работы."
//         },
//         {
//             icon: Users,
//             title: "Доступность",
//             description: "Психологическая помощь должна быть доступна каждому, независимо от местоположения."
//         }
//     ];
//
//     const stats = [
//         { number: "50,000+", label: "Довольных клиентов" },
//         { number: "4,300+", label: "Проверенных психологов" },
//         { number: "500,000+", label: "Проведенных сессий" },
//         { number: "4.8", label: "Средняя оценка" }
//     ];
//
//     return (
//         <div className="min-h-screen bg-white">
//             {/* Hero Section */}
//             <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center">
//                         <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
//                             О <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">PsyPortal</span>
//                         </h1>
//                         <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//                             Мы создаем мир, где каждый человек может получить качественную психологическую помощь
//                             в удобном формате, не выходя из дома.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Mission Section */}
//             <div className="py-16">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//                         <div>
//                             <h2 className="text-3xl font-bold text-gray-900 mb-6">Наша миссия</h2>
//                             <p className="text-lg text-gray-600 mb-6 leading-relaxed">
//                                 Мы верим, что психологическое здоровье так же важно, как и физическое.
//                                 Наша цель — разрушить барьеры, которые мешают людям обращаться за помощью,
//                                 и сделать психотерапию максимально доступной и эффективной.
//                             </p>
//                             <p className="text-lg text-gray-600 leading-relaxed">
//                                 PsyPortal объединяет лучших специалистов и современные технологии,
//                                 чтобы каждый мог найти своего психолога и начать путь к лучшей версии себя.
//                             </p>
//                         </div>
//                         <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-2xl text-white">
//                             <div className="grid grid-cols-2 gap-6">
//                                 {stats.map((stat, index) => (
//                                     <div key={index} className="text-center">
//                                         <div className="text-3xl font-bold mb-2">{stat.number}</div>
//                                         <div className="text-sm opacity-90">{stat.label}</div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Values Section */}
//             <div className="bg-gray-50 py-16">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-12">
//                         <h2 className="text-3xl font-bold text-gray-900 mb-4">Наши ценности</h2>
//                         <p className="text-lg text-gray-600">
//                             Принципы, которыми мы руководствуемся в работе
//                         </p>
//                     </div>
//
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                         {values.map((value, index) => {
//                             const Icon = value.icon;
//                             return (
//                                 <div key={index} className="bg-white p-6 rounded-xl text-center">
//                                     <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
//                                         <Icon className="h-6 w-6 text-blue-600" />
//                                     </div>
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
//                                     <p className="text-gray-600">{value.description}</p>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>
//
//             {/* Team Section */}
//             <div className="py-16">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-12">
//                         <h2 className="text-3xl font-bold text-gray-900 mb-4">Наша команда</h2>
//                         <p className="text-lg text-gray-600">
//                             Люди, которые делают PsyPortal лучше каждый день
//                         </p>
//                     </div>
//
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                         {team.map((member, index) => (
//                             <div key={index} className="text-center">
//                                 <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
//                                     {member.image}
//                                 </div>
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
//                                 <p className="text-sm text-blue-600 mb-3">{member.role}</p>
//                                 <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//
//             {/* CTA Section */}
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
//                 <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//                     <h2 className="text-3xl font-bold text-white mb-4">
//                         Присоединяйтесь к нашему сообществу
//                     </h2>
//                     <p className="text-xl text-blue-100 mb-8">
//                         Начните свой путь к психологическому благополучию уже сегодня
//                     </p>
//                     <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
//                         Найти психолога
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// // How It Works Page Component
// const HowItWorksPage = () => {
//     const [activeStep, setActiveStep] = useState(0);
//
//     const steps = [
//         {
//             number: "01",
//             title: "Найдите своего психолога",
//             description: "Используйте наши фильтры, чтобы найти специалиста, который подходит именно вам",
//             details: [
//                 "Выберите специализацию психолога",
//                 "Укажите предпочитаемый подход к терапии",
//                 "Установите удобный ценовой диапазон",
//                 "Изучите профили и отзывы специалистов"
//             ],
//             icon: Users
//         },
//         {
//             number: "02",
//             title: "Запишитесь на сессию",
//             description: "Выберите удобное время и запишитесь на первую консультацию",
//             details: [
//                 "Посмотрите доступное время психолога",
//                 "Выберите подходящий временной слот",
//                 "Оплатите сессию безопасным способом",
//                 "Получите подтверждение записи"
//             ],
//             icon: Calendar
//         },
//         {
//             number: "03",
//             title: "Проведите сессию",
//             description: "Общайтесь с психологом через защищенную видеосвязь прямо в браузере",
//             details: [
//                 "Подключитесь к сессии за 5 минут до начала",
//                 "Используйте качественную видео и аудио связь",
//                 "Все данные защищены end-to-end шифрованием",
//                 "Сессия длится 50 минут"
//             ],
//             icon: Video
//         },
//         {
//             number: "04",
//             title: "Продолжите работу",
//             description: "Планируйте следующие встречи и отслеживайте свой прогресс",
//             details: [
//                 "Оцените прошедшую сессию",
//                 "Запишитесь на следующую встречу",
//                 "Ведите личный дневник прогресса",
//                 "Общайтесь с психологом между сессиями"
//             ],
//             icon: Star
//         }
//     ];
//
//     const features = [
//         {
//             icon: Lock,
//             title: "Полная конфиденциальность",
//             description: "Все ваши данные и разговоры защищены военным шифрованием"
//         },
//         {
//             icon: Clock,
//             title: "Гибкое расписание",
//             description: "Записывайтесь на удобное время, включая вечера и выходные"
//         },
//         {
//             icon: Headphones,
//             title: "Качественная связь",
//             description: "HD видео и кристально чистый звук для комфортного общения"
//         },
//         {
//             icon: FileText,
//             title: "Ведение записей",
//             description: "Психолог ведет заметки, а вы можете отслеживать свой прогресс"
//         },
//         {
//             icon: MessageCircle,
//             title: "Поддержка 24/7",
//             description: "Наша команда поддержки всегда готова помочь с любыми вопросами"
//         }
//     ];
//
//     const faqs = [
//         {
//             question: "Насколько безопасна платформа?",
//             answer: "Мы используем банковское шифрование для защиты всех данных. Видеозвонки проходят через защищенные каналы, а персональная информация хранится в соответствии с международными стандартами безопасности."
//         },
//         {
//             question: "Можно ли отменить или перенести сессию?",
//             answer: "Да, вы можете отменить или перенести сессию не позднее чем за 24 часа до начала. В этом случае деньги будут возвращены или перенесены на новое время."
//         },
//         {
//             question: "Что если мне не подойдет психолог?",
//             answer: "Если после первой сессии вы поймете, что специалист вам не подходит, мы поможем подобрать другого психолога бесплатно. Ваш комфорт и результат - наш приоритет."
//         },
//         {
//             question: "Какое оборудование нужно для сессий?",
//             answer: "Достаточно любого устройства с камерой и микрофоном: компьютер, планшет или смартфон. Платформа работает прямо в браузере, никаких дополнительных программ устанавливать не нужно."
//         },
//         {
//             question: "Можно ли получить справку для работодателя?",
//             answer: "Да, по запросу мы можем предоставить справку о прохождении психологических консультаций без указания деталей обсуждаемых вопросов."
//         }
//     ];
//
//     return (
//         <div className="min-h-screen bg-white">
//             {/* Hero Section */}
//             <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center">
//                         <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
//                             Как это <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">работает</span>
//                         </h1>
//                         <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//                             Получить профессиональную психологическую помощь стало проще.
//                             Всего 4 простых шага отделяют вас от первой сессии.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Steps Section */}
//             <div className="py-20">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//                         {/* Steps Navigation */}
//                         <div className="space-y-8">
//                             {steps.map((step, index) => {
//                                 const Icon = step.icon;
//                                 return (
//                                     <div
//                                         key={index}
//                                         className={`cursor-pointer transition-all duration-300 ${
//                                             activeStep === index ? 'transform scale-105' : ''
//                                         }`}
//                                         onClick={() => setActiveStep(index)}
//                                     >
//                                         <div className={`p-6 rounded-xl border-2 transition-colors ${
//                                             activeStep === index
//                                                 ? 'border-blue-500 bg-blue-50'
//                                                 : 'border-gray-200 bg-white hover:border-blue-300'
//                                         }`}>
//                                             <div className="flex items-center mb-4">
//                                                 <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
//                                                     activeStep === index
//                                                         ? 'bg-blue-600 text-white'
//                                                         : 'bg-gray-100 text-gray-600'
//                                                 }`}>
//                                                     <Icon className="h-6 w-6" />
//                                                 </div>
//                                                 <div>
//                                                     <div className={`text-sm font-medium ${
//                                                         activeStep === index ? 'text-blue-600' : 'text-gray-500'
//                                                     }`}>
//                                                         Шаг {step.number}
//                                                     </div>
//                                                     <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
//                                                 </div>
//                                             </div>
//                                             <p className="text-gray-600">{step.description}</p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//
//                         {/* Step Details */}
//                         <div className="lg:sticky lg:top-8">
//                             <div className="bg-white border border-gray-200 rounded-xl p-8">
//                                 <div className="flex items-center mb-6">
//                                     <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
//                                         {steps[activeStep].number}
//                                     </div>
//                                     <div>
//                                         <h3 className="text-2xl font-bold text-gray-900">{steps[activeStep].title}</h3>
//                                         <p className="text-gray-600">{steps[activeStep].description}</p>
//                                     </div>
//                                 </div>
//
//                                 <div className="space-y-3">
//                                     {steps[activeStep].details.map((detail, index) => (
//                                         <div key={index} className="flex items-center">
//                                             <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
//                                             <span className="text-gray-700">{detail}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//
//                                 <button className="w-full mt-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
//                                     {activeStep === 0 ? 'Найти психолога' :
//                                         activeStep === 1 ? 'Записаться на сессию' :
//                                             activeStep === 2 ? 'Начать сессию' : 'Продолжить работу'}
//                                     <ArrowRight className="ml-2 h-4 w-4" />
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Features Section */}
//             <div className="bg-gray-50 py-16">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-12">
//                         <h2 className="text-3xl font-bold text-gray-900 mb-4">Почему выбирают PsyPortal</h2>
//                         <p className="text-lg text-gray-600">
//                             Мы создали платформу, которая делает психотерапию удобной и эффективной
//                         </p>
//                     </div>
//
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                         {features.map((feature, index) => {
//                             const Icon = feature.icon;
//                             return (
//                                 <div key={index} className="bg-white p-6 rounded-xl">
//                                     <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
//                                         <Icon className="h-6 w-6 text-blue-600" />
//                                     </div>
//                                     <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
//                                     <p className="text-gray-600">{feature.description}</p>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>
//
//             {/* Demo Video Section */}
//             <div className="py-16">
//                 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//                     <h2 className="text-3xl font-bold text-gray-900 mb-4">Посмотрите, как это работает</h2>
//                     <p className="text-lg text-gray-600 mb-8">
//                         Короткое видео о том, как проходит сессия на нашей платформе
//                     </p>
//
//                     <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl overflow-hidden">
//                         <div className="aspect-video flex items-center justify-center">
//                             <button className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-300 group">
//                                 <Play className="h-8 w-8 text-white ml-1 group-hover:scale-110 transition-transform" />
//                             </button>
//                         </div>
//                         <div className="absolute inset-0 bg-black bg-opacity-20"></div>
//                     </div>
//                 </div>
//             </div>
//
//             {/* FAQ Section */}
//             <div className="bg-gray-50 py-16">
//                 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="text-center mb-12">
//                         <h2 className="text-3xl font-bold text-gray-900 mb-4">Часто задаваемые вопросы</h2>
//                         <p className="text-lg text-gray-600">
//                             Ответы на самые популярные вопросы о нашей платформе
//                         </p>
//                     </div>
//
//                     <div className="space-y-6">
//                         {faqs.map((faq, index) => (
//                             <div key={index} className="bg-white rounded-xl p-6">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
//                                 <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//
//             {/* CTA Section */}
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
//                 <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
//                     <h2 className="text-3xl font-bold text-white mb-4">
//                         Готовы начать свой путь к лучшему самочувствию?
//                     </h2>
//                     <p className="text-xl text-blue-100 mb-8">
//                         Запишитесь на первую консультацию уже сегодня
//                     </p>
//                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                         <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
//                             Найти психолога
//                         </button>
//                         <button className="px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold">
//                             Остались вопросы?
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// // Combined Component with Navigation
// const AboutAndHowItWorks = () => {
//     const [currentPage, setCurrentPage] = useState('about');
//
//     return (
//         <div>
//             {/* Page Navigation */}
//             <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <nav className="flex space-x-8">
//                         <button
//                             onClick={() => setCurrentPage('about')}
//                             className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
//                                 currentPage === 'about'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                             }`}
//                         >
//                             О нас
//                         </button>
//                         <button
//                             onClick={() => setCurrentPage('how-it-works')}
//                             className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
//                                 currentPage === 'how-it-works'
//                                     ? 'border-blue-500 text-blue-600'
//                                     : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                             }`}
//                         >
//                             Как это работает
//                         </button>
//                     </nav>
//                 </div>
//             </div>
//
//             {/* Page Content */}
//             {currentPage === 'about' ? <AboutUsPage /> : <HowItWorksPage />}
//         </div>
//     );
// };
//
// export default AboutAndHowItWorks;

// app/how-it-works/page.tsx
'use client';

import React from 'react';
import { CheckCircle, Users, Calendar, Video, Shield, Star } from 'lucide-react';

const HowItWorksPage: React.FC = () => {
    const steps = [
        {
            icon: Users,
            title: 'Выберите психолога',
            description: 'Найдите специалиста по специализации, подходу и цене. Изучите профили, отзывы и рейтинги.',
            details: ['Более 4000 проверенных психологов', 'Подробные профили с образованием и опытом', 'Реальные отзывы клиентов']
        },
        {
            icon: Calendar,
            title: 'Забронируйте сессию',
            description: 'Выберите удобное время из доступных слотов психолога. Оплатите сессию безопасно.',
            details: ['Гибкое расписание 24/7', 'Мгновенное подтверждение', 'Безопасная оплата']
        },
        {
            icon: Video,
            title: 'Проведите сессию',
            description: 'Встретьтесь с психологом в видеочате. Никаких дополнительных программ не требуется.',
            details: ['HD качество видео и звука', 'Работает в любом браузере', 'Полная конфиденциальность']
        },
        {
            icon: Star,
            title: 'Оцените результат',
            description: 'После сессии оставьте отзыв и запишитесь на следующую встречу при необходимости.',
            details: ['Система оценок и отзывов', 'Простое повторное бронирование', 'Отслеживание прогресса']
        }
    ];

    const benefits = [
        {
            icon: Shield,
            title: 'Конфиденциальность',
            description: 'Все данные защищены. Полная анонимность гарантирована.'
        },
        {
            icon: CheckCircle,
            title: 'Проверенные специалисты',
            description: 'Все психологи имеют профильное образование и опыт работы.'
        },
        {
            icon: Calendar,
            title: 'Удобное время',
            description: 'Выберите любое удобное время, включая вечера и выходные.'
        }
    ];

    return (
        <div className="min-h-screen bg-white pt-16">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-6">
                        Как работает PsyPortal
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Получите профессиональную психологическую помощь всего за 4 простых шага
                    </p>
                </div>
            </div>

            {/* Steps Section */}
            <div className="py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-16">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isEven = index % 2 === 0;

                            return (
                                <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                                    <div className="lg:w-1/2">
                                        <div className="flex items-center mb-4">
                                            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                                                {index + 1}
                                            </div>
                                            <Icon className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                                        <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                                        <ul className="space-y-2">
                                            {step.details.map((detail, detailIndex) => (
                                                <li key={detailIndex} className="flex items-center text-gray-700">
                                                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="lg:w-1/2">
                                        <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                                            <Icon className="h-24 w-24 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Преимущества онлайн-терапии
                        </h2>
                        <p className="text-lg text-gray-600">
                            Современный подход к психологической помощи
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-3 bg-blue-100 rounded-full">
                                            <Icon className="h-8 w-8 text-blue-600" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600">{benefit.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-blue-600 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Готовы начать свой путь к лучшему самочувствию?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Найдите своего психолога уже сегодня
                    </p>
                    <a
                        href="/therapists"
                        className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                        Найти психолога
                    </a>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksPage;
