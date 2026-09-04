import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route as routeFn } from 'ziggy-js';
import { initializeTheme } from './hooks/use-appearance';

declare global {
    const route: typeof routeFn;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function updateFavicon(logoUrl: unknown): void {
    const href = typeof logoUrl === 'string' && logoUrl.length > 0 ? logoUrl : '/favicon.ico';
    let favicon = document.querySelector<HTMLLinkElement>('#site-favicon');

    if (!favicon) {
        favicon = document.createElement('link');
        favicon.id = 'site-favicon';
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }

    favicon.href = href;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const initialBranding = props.initialPage.props.branding as { logo_url?: unknown } | null | undefined;

        updateFavicon(initialBranding?.logo_url);
        router.on('navigate', (event) => {
            const branding = event.detail.page.props.branding as { logo_url?: unknown } | null | undefined;
            updateFavicon(branding?.logo_url);
        });

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

if ('serviceWorker' in navigator && window.isSecureContext) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').catch(() => undefined);
    });
}
