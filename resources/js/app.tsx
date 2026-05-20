import './bootstrap.js';
import '../css/app.css'; // Import here instead of vite.config.js (ref: https://laravel.com/docs/12.x/vite#configuring-vite)

import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { ComponentType } from 'react';

createInertiaApp({
    resolve: (name) =>
        // resolvePageComponent(
        //     `./Pages/${name}.tsx`,
        //     import.meta.glob('./Pages/**/*.tsx'),
        // ) as unknown as ComponentType,
        {
            const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
            return pages[`./Pages/${name}.tsx`] as ComponentType;
        },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    }
});
