// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Разрешить доступ ко всем страницам без проверки авторизации
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Исключите /therapists из защищенных маршрутов
        '/profile/:path*',
        '/settings/:path*'
    ]
}