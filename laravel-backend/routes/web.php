<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/event/{id}', function ($id) {
    return view('event-details');
});
