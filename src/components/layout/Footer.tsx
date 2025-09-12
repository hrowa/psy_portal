// app/components/layout/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { Phone } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="text-2xl font-bold text-blue-400 mb-4">PsyPortal</div>
                        <p className="text-gray-400 mb-4">
                            Платформа онлайн-консультаций с психологами
                        </p>
                        <div className="flex items-center space-x-2">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <span className="text-gray-400">+7 (800) 555-35-35</span>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Для клиентов</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/therapists" className="text-gray-400 hover:text-white transition-colors">
                                    Найти психолога
                                </Link>
                            </li>
                            <li>
                                <Link href="/how-it-works" className="text-gray-400 hover:text-white transition-colors">
                                    Как это работает
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                                    Цены
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
                                    Поддержка
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Для психологов</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/become-therapist" className="text-gray-400 hover:text-white transition-colors">
                                    Стать психологом
                                </Link>
                            </li>
                            <li>
                                <Link href="/therapist-pricing" className="text-gray-400 hover:text-white transition-colors">
                                    Тарифы
                                </Link>
                            </li>
                            <li>
                                <Link href="/training" className="text-gray-400 hover:text-white transition-colors">
                                    Обучение
                                </Link>
                            </li>
                            <li>
                                <Link href="/supervision" className="text-gray-400 hover:text-white transition-colors">
                                    Супервизии
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Компания</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                                    О нас
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                                    Карьера
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                                    Контакты
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 PsyPortal. Все права защищены.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Политика конфиденциальности
                        </Link>
                        <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                            Пользовательское соглашение
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;


// // src/components/layout/Footer.tsx
// import React from 'react';
// import Link from 'next/link';
// import { Phone, Mail, MapPin } from 'lucide-react';
//
// export const Footer: React.FC = () => {
//     const footerSections = [
//         {
//             title: 'Для клиентов',
//             links: [
//                 { name: 'Найти психолога', href: '/therapists' },
//                 { name: 'Как это работает', href: '/how-it-works' },
//                 { name: 'Цены', href: '/pricing' },
//                 { name: 'Поддержка', href: '/contact' },
//             ],
//         },
//         {
//             title: 'Для психологов',
//             links: [
//                 { name: 'Стать психологом', href: '/auth/signup?role=therapist' },
//                 { name: 'Тарифы', href: '/pricing#therapists' },
//                 { name: 'Обучение', href: '/education' },
//                 { name: 'Супервизии', href: '/supervision' },
//             ],
//         },
//         {
//             title: 'Компания',
//             links: [
//                 { name: 'О нас', href: '/about' },
//                 { name: 'Блог', href: '/blog' },
//                 { name: 'Карьера', href: '/careers' },
//                 { name: 'Контакты', href: '/contact' },
//             ],
//         },
//         {
//             title: 'Правовая информация',
//             links: [
//                 { name: 'Политика конфиденциальности', href: '/privacy' },
//                 { name: 'Пользовательское соглашение', href: '/terms' },
//                 { name: 'Лицензии', href: '/licenses' },
//                 { name: 'Безопасность', href: '/security' },
//             ],
//         },
//     ];
//
//     return (
//         <footer className="bg-gray-900 text-white">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
//                     {/* Company Info */}
//                     <div className="lg:col-span-1">
//                         <div className="text-2xl font-bold text-blue-400 mb-4">PsyPortal</div>
//                         <p className="text-gray-400 mb-4 text-sm leading-relaxed">
//                             Платформа онлайн-консультаций с психологами. Делаем психологическую помощь
//                             доступной каждому.
//                         </p>
//                         <div className="space-y-2 text-sm">
//                             <div className="flex items-center text-gray-400">
//                                 <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
//                                 <span>+7 (800) 555-35-35</span>
//                             </div>
//                             <div className="flex items-center text-gray-400">
//                                 <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
//                                 <span>hello@psyportal.ru</span>
//                             </div>
//                             <div className="flex items-center text-gray-400">
//                                 <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
//                                 <span>Москва, Россия</span>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Footer Links */}
//                     {footerSections.map((section) => (
//                         <div key={section.title}>
//                             <h3 className="font-semibold mb-4 text-white">{section.title}</h3>
//                             <ul className="space-y-2">
//                                 {section.links.map((link) => (
//                                     <li key={link.name}>
//                                         <Link
//                                             href={link.href}
//                                             className="text-gray-400 hover:text-white transition-colors text-sm"
//                                         >
//                                             {link.name}
//                                         </Link>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     ))}
//                 </div>
//
//                 {/* Bottom section */}
//                 <div className="border-t border-gray-800 mt-8 pt-8">
//                     <div className="flex flex-col md:flex-row justify-between items-center">
//                         <p className="text-gray-400 text-sm">
//                             © 2024 PsyPortal. Все права защищены.
//                         </p>
//                         <div className="flex space-x-6 mt-4 md:mt-0">
//                             <Link
//                                 href="/privacy"
//                                 className="text-gray-400 hover:text-white text-sm transition-colors"
//                             >
//                                 Конфиденциальность
//                             </Link>
//                             <Link
//                                 href="/terms"
//                                 className="text-gray-400 hover:text-white text-sm transition-colors"
//                             >
//                                 Условия использования
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </footer>
//     );
// };