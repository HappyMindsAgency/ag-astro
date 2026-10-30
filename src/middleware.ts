import { defineMiddleware } from 'astro:middleware';

// Imposta a false per riaprire il sito a tutti.
export const MAINTENANCE_MODE = true;

const BYPASS_VALUE = 'agtrustees';
const BYPASS_COOKIE = 'ag_maintenance_bypass';
const BYPASS_MAX_AGE = 60 * 60 * 12;
const MAINTENANCE_PATH = '/maintenance/';

export const onRequest = defineMiddleware((context, next) => {
    if (!MAINTENANCE_MODE) return next();

    const { url, cookies } = context;

    // Pagina di manutenzione e file statici (CSS, immagini, font) restano raggiungibili.
    if (url.pathname.replace(/\/?$/, '/') === MAINTENANCE_PATH || /\.[a-z0-9]+$/i.test(url.pathname)) {
        return next();
    }

    if (url.searchParams.get('bypass') === BYPASS_VALUE) {
        cookies.set(BYPASS_COOKIE, BYPASS_VALUE, {
            path: '/',
            maxAge: BYPASS_MAX_AGE,
            httpOnly: true,
            sameSite: 'lax',
            secure: url.protocol === 'https:',
        });
        return next();
    }

    if (cookies.get(BYPASS_COOKIE)?.value === BYPASS_VALUE) return next();

    return context.rewrite(MAINTENANCE_PATH);
});
