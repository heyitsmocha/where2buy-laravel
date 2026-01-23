<?php

use App\Http\Controllers\AnswerController;
use App\Http\Controllers\InquiryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::resource('answers', AnswerController::class);
Route::resource('inquiries', InquiryController::class);
