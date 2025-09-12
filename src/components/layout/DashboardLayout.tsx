// src/components/layout/DashboardLayout.tsx
import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="pt-16 flex">
                <Sidebar className="hidden lg:flex" />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
};