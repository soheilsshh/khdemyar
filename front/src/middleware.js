// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {

    const hostname = request.headers.get('host');
    const url = request.nextUrl.clone();
        if (url.pathname === '/') {
            url.pathname = '/home';
            return NextResponse.redirect(url);
        }

    return NextResponse.next();
}
