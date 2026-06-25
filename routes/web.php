<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Web\AuthController;
use App\Models\Inquiry;

function getInitialCoords(Request $request) {
    $fallbackCoordinate = [4.86751298960347, 108.92222921712094]; // Between Peninsular Malaysia and Borneo
    $fallbackZoom = 5; // Zoom level for whole of Malaysia

    // TODO: Try first to get geolocation from the browser, and let the ip geolocation be a fallback.

    // Try to geolocate the user based on their IP address
    $ip = $request->ip();
    if ($ip === '127.0.0.1' || str_starts_with($ip, '192.168.')) {
        // Get the public IP address of the client, local IPs won't work for ip-api.com
        $ip = trim(file_get_contents('https://api.ipify.org'));
    }

    try {
        $response = Http::get("http://ip-api.com/json/{$ip}");
        $data = $response->json();

        if ($data['status'] === 'success') {
            $coordinates = [$data['lat'], $data['lon']];
            $zoom = 16; // Closer zoom for user location

            return [$coordinates, $zoom];
        }
    } catch (\Exception $e) {
        // Absorb any exceptions and fall back to default coordinates
    }
    // If geolocation fails, use fallback coordinates and zoom
    return [$fallbackCoordinate, $fallbackZoom];
}

Route::get('/', function (Request $request) {
    [$initialCoordinates, $initialZoom] = getInitialCoords($request);
    return Inertia::render('Home/Home', [
        'initialCoordinates' => [
            'latitude' => $initialCoordinates[0],
            'longitude' => $initialCoordinates[1],
        ],
        'initialZoom' => $initialZoom,
    ]);
});

Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/logout', 'logout')->middleware('auth');
});

Route::get('/inquiries/me', function (Request $request) {
    $inquiries = $request->user()->inquiries()->with('item')->get();
    $inquiries = $inquiries->sortByDesc('created_at')->values(); // Sort by latest
    return Inertia::render('MyInquiries', [
        'inquiries' => $inquiries->toResourceCollection()->resolve(), // Convert to resource collection and resolve to array
    ]);
})->middleware('auth');

Route::get('/inquiries/me/{inquiry}', function (Inquiry $inquiry) {
    $inquiry->load('answers'); // Eager load item and answers relationships

    return Inertia::render('MyInquiryDetail', [
        'inquiry' => $inquiry->toResource(),
    ]);
})->middleware('auth');
