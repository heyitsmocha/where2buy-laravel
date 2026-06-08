<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // sidebar_state came built-in with the component, so no need to define our own state for tracking expanded state.
        $sidebarStateCookie = $request->cookie('sidebar_state');

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebar' => [
                'state' => $sidebarStateCookie === null ? true : filter_var($sidebarStateCookie, FILTER_VALIDATE_BOOLEAN),
            ]
        ];
    }
}
