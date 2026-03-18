<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// --- AUTH ---
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout',   [AuthController::class, 'logout']);
    Route::get('/auth/current',   [AuthController::class, 'current']);
    Route::put('/auth/profile',   [AuthController::class, 'updateProfile']);
});

// --- EVENTS (public list) ---
Route::get('/events', [EventController::class, 'index']);

// --- EVENTS (protected) — must come BEFORE the wildcard {id} route ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/events/user/my',    [EventController::class, 'myEvents']);
    Route::post('/events',           [EventController::class, 'store']);
    Route::put('/events/{id}',       [EventController::class, 'update']);
    Route::delete('/events/{id}',    [EventController::class, 'destroy']);
});

// --- EVENTS (public detail) — wildcard last so specific routes match first ---
Route::get('/events/{id}', [EventController::class, 'show']);

// --- FAVORITES (protected) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/favorites',              [FavoriteController::class, 'index']);
    Route::post('/favorites',             [FavoriteController::class, 'store']);
    Route::delete('/favorites/{eventId}', [FavoriteController::class, 'destroy']);
});

// --- UPLOAD (protected) ---
Route::middleware('auth:sanctum')->post('/upload', [UploadController::class, 'store']);

// --- USERS (public) ---
Route::get('/users', [UserController::class, 'index']);
