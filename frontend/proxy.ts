import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('sys_token')?.value;
  const { pathname } = request.url ? new URL(request.url) : { pathname: '' };

  // Actualizamos para que detecte la ruta correcta con syspanel
  const isDashboardRoute = pathname.startsWith('/syspanel/dashboard');

  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/syspanel/dashboard/:path*'],
};