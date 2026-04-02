<?php

use App\Http\Controllers\AnswerController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(UserController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');

    // Login-protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        Route::post('/logout', 'logout');
    });
});

// Inquiries
Route::controller(InquiryController::class)
    ->prefix('inquiries')
    ->group(function () {
        Route::get('/', 'index');
        Route::get('/{inquiry}', 'show');

        // Login-protected routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/', 'store');
            Route::put('/{inquiry}', 'update');
            Route::delete('/{inquiry}', 'destroy');

            Route::get('/me', 'myInquiries');
        });
    });

// Answers
Route::controller(AnswerController::class)
    ->prefix('answers')
    ->group(function () {
        Route::get('/', 'index');
        Route::get('/{answer}', 'show');

        // Login-protected routes
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/', 'store');
            Route::put('/{answer}', 'update');
            Route::delete('/{answer}', 'destroy');

            Route::get('/me', 'myAnswers');
        });
    });

