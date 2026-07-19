import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Excluye rutas internas de Next.js, API y ficheros estáticos (con extensión).
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
