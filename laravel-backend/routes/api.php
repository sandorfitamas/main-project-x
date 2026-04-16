<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\UserController;

// =========================
// Hítelesítés
// =========================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/current', [AuthController::class, 'current']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });
});

// =========================
// Események
// =========================
// Publikus esemény lista
Route::get('/events', [EventController::class, 'index']);
// Publikus esemény részletek (mindig utoljára, hogy ne ütközzön más route-tal)
Route::get('/events/{id}', [EventController::class, 'show']);

// Védett esemény műveletek
Route::middleware('auth:sanctum')->group(function () {
    // Saját események
    Route::get('/events/user/my', [EventController::class, 'myEvents']);
    // Létrehozás, módosítás, törlés
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{id}', [EventController::class, 'update']);
    Route::delete('/events/{id}', [EventController::class, 'destroy']);
    // Részvétel
    Route::post('/events/{id}/attend', [EventController::class, 'toggleAttendance']);
    Route::get('/events/{id}/attend', [EventController::class, 'checkAttendance']);
});

// =========================
// Közösség
// =========================
Route::get('/attendances/recent', [EventController::class, 'recentAttendances']);

// =========================
// Jegyek
// =========================
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/events/{id}/buy', [\App\Http\Controllers\TicketController::class, 'buyTicket']);
    Route::post('/checkout', [\App\Http\Controllers\CheckoutController::class, 'process']);
    Route::get('/tickets', [\App\Http\Controllers\TicketController::class, 'getUserTickets']);
});

// =========================
// Vélemyények/Értékelések
// =========================
Route::get('/reviews/recent', [ReviewController::class, 'recent']);
Route::get('/events/{id}/reviews', [ReviewController::class, 'index']);
Route::middleware('auth:sanctum')->post('/events/{id}/reviews', [ReviewController::class, 'store']);

// =========================
// Kedvencek
// =========================
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{eventId}', [FavoriteController::class, 'destroy']);
});

// =========================
// Feltöltés
// =========================
Route::middleware('auth:sanctum')->post('/upload', [UploadController::class, 'store']);

// =========================
// FELHASZNÁLÓK
// =========================
Route::get('/users', [UserController::class, 'index']);

// =========================
// ADMIN (védett, prefix: /admin)
// =========================
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
