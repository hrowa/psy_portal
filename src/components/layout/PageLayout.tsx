// src/components/layout/PageLayout.tsx
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface PageLayoutProps {
    children: React.ReactNode;
    showFooter?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
                                                          children,
                                                          showFooter = true
                                                      }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-16">
                {children}
            </main>
            {showFooter && <Footer />}
        </div>
    );
};