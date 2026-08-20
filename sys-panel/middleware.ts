import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("sys_token")?.value;
  const { pathname } = request.nextUrl;

  // Verificamos si el token existe y tiene contenido válido
  const isAuthenticated = Boolean(token && token.trim() !== "");

  // 1. Si intenta ir a cualquier ruta dentro de /dashboard y NO está autenticado
  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Si intenta ir a la raíz (login "/") y YA está autenticado
  if (pathname === "/" && isAuthenticated) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Configuramos las rutas estrictas sobre las cuales actuará el middleware
export const config = {
  matcher: [
    "/",
    "/dashboard/:path*"
  ],
};