<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ReviewController;
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
    
    // Attendance routes
    Route::post('/events/{id}/attend', [EventController::class, 'toggleAttendance']);
    Route::get('/events/{id}/attend',  [EventController::class, 'checkAttendance']);
});

// --- COMMUNITY ---
Route::get('/attendances/recent', [EventController::class, 'recentAttendances']);

// --- TICKETS ---
Route::middleware('auth:sanctum')->post('/events/{id}/buy', [\App\Http\Controllers\TicketController::class, 'buyTicket']);
Route::middleware('auth:sanctum')->post('/checkout', [\App\Http\Controllers\CheckoutController::class, 'process']);
Route::middleware('auth:sanctum')->get('/tickets', [\App\Http\Controllers\TicketController::class, 'getUserTickets']);

// --- EVENTS (public detail) — wildcard last so specific routes match first ---
Route::get('/events/{id}', [EventController::class, 'show']);

// --- REVIEWS ---
Route::get('/reviews/recent', [ReviewController::class, 'recent']);
Route::get('/events/{id}/reviews', [ReviewController::class, 'index']);
Route::middleware('auth:sanctum')->post('/events/{id}/reviews', [ReviewController::class, 'store']);

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
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'dashboard']);
    Route::get('/users', [\App\Http\Controllers\AdminController::class, 'users']);
    Route::delete('/users/{id}', [\App\Http\Controllers\AdminController::class, 'deleteUser']);
    Route::post('/users/{id}/suspend', [\App\Http\Controllers\AdminController::class, 'suspendUser']);
    Route::get('/events', [\App\Http\Controllers\AdminController::class, 'events']);
    Route::delete('/events/{id}', [\App\Http\Controllers\AdminController::class, 'deleteEvent']);
    Route::post('/events/{id}/suspend', [\App\Http\Controllers\AdminController::class, 'suspendEvent']);
    Route::get('/reviews', [\App\Http\Controllers\AdminController::class, 'reviews']);
    Route::delete('/reviews/{id}', [\App\Http\Controllers\AdminController::class, 'deleteReview']);
});
