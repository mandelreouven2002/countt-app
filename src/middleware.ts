import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // אנחנו מגינים רק על נתיבי הפעולות (Actions) ב-API
  if (request.nextUrl.pathname.startsWith('/api/actions/')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // מוודאים שהבקשה מגיעה מהדומיין שלנו בלבד
    if (origin && host) {
      try {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json(
            { error: 'Unauthorized request origin. API access denied.' },
            { status: 403 }
          );
        }
      } catch (e) {
        return NextResponse.json({ error: 'Invalid origin format.' }, { status: 400 });
      }
    }
  }
  return NextResponse.next();
}

// מחילים את המידלוור על כל בקשות ה-POST ל-API
export const config = {
  matcher: '/api/actions/:path*',
};
