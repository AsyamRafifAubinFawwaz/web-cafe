<?php

use App\Http\Controllers\Admin\CategoriesController;
use App\Http\Controllers\Admin\GalleriesController;
use App\Http\Controllers\Admin\MenusController;
use App\Http\Controllers\Admin\PromosController;
use App\Http\Controllers\Admin\ReservationItemsController;
use App\Http\Controllers\Admin\ReservationMembersController;
use App\Http\Controllers\Admin\ReservationPackagesController;
use App\Http\Controllers\Admin\ReservationsController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::prefix('admin')->group(function () {
        Route::resource('categories', CategoriesController::class)->names('categories');
        Route::resource('menus', MenusController::class)->names('menus');
        Route::resource('galleries', GalleriesController::class)->names('galleries');
        Route::resource('promos', PromosController::class)->names('promos');
        Route::resource('reservation-packages', ReservationPackagesController::class)->names('reservation-packages');
        Route::resource('reservations', ReservationsController::class)->names('reservations');
        Route::resource('reservation-members', ReservationMembersController::class)->names('reservation-members');
        Route::resource('reservation-items', ReservationItemsController::class)->names('reservation-items');
    });
});

require __DIR__ . '/settings.php';

