<?php

use App\Http\Controllers\Admin\CategoriesController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::prefix('admin')->group(function () {
        Route::resource('categories', CategoriesController::class)->names('categories');
    });
});



require __DIR__ . '/settings.php';
