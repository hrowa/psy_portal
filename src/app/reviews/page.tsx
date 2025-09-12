// app/components/layout/MainLayout.tsx
'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout//Footer';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);

    const handleOpenLogin = () => {
        setShowRegisterModal(false);
        setShowLoginModal(true);
    };

    const handleOpenRegister = () => {
        setShowLoginModal(false);
        setShowRegisterModal(true);
    };

    const handleCloseModals = () => {
        setShowLoginModal(false);
        setShowRegisterModal(false);
    };

    return (
        <>
            <Header
                onOpenLogin={handleOpenLogin}
                onOpenRegister={handleOpenRegister}
            />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />

            <LoginModal
                isOpen={showLoginModal}
                onClose={handleCloseModals}
                onSwitchToRegister={handleOpenRegister}
            />

            <RegisterModal
                isOpen={showRegisterModal}
                onClose={handleCloseModals}
                onSwitchToLogin={handleOpenLogin}
            />
        </>
    );
};

export default MainLayout;