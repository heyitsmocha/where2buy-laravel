import './bootstrap.js';
import '../css/app.css'; // Import here instead of vite.config.js (ref: https://laravel.com/docs/12.x/vite#configuring-vite)

import { createInertiaApp, type ResolvedComponent } from '@inertiajs/react'
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

createInertiaApp({
    resolve: (name) =>
        resolvePageComponent<ResolvedComponent>(
            `./Pages/${name}.tsx`,
            import.meta.glob<ResolvedComponent>('./Pages/**/*.tsx'),
        ) ,
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    }
});
