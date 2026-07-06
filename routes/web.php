<?php

use App\Http\Controllers\Admin\CategoriesController;
use App\Http\Controllers\Admin\GalleriesController;
use App\Http\Controllers\Admin\InvoicesController;
use App\Http\Controllers\Admin\MenusController;
use App\Http\Controllers\Admin\PromosController;
use App\Http\Controllers\Admin\ReservationItemsController;
use App\Http\Controllers\Admin\ReservationMembersController;
use App\Http\Controllers\Admin\ReservationPackagesController;
use App\Http\Controllers\Admin\ReservationsController;
use App\Http\Controllers\Admin\TableOrdersController;
use App\Http\Controllers\Admin\TableOrderItemsController;
use App\Http\Controllers\Admin\TablesController;
use App\Http\Controllers\GuestOrderController;
use Illuminate\Support\Facades\Route;
use App\Models\Categories;
use App\Models\Menus;
use App\Models\Promos;
use App\Models\Galleries;

Route::get('/', function () {
    $categories = Categories::orderBy('name', 'asc')->get();

    $menus = Menus::with(['category', 'promo' => function ($query) {
        $query->where('is_active', true);
    }])->orderBy('name', 'asc')->get()->map(function ($menu) {
        $hasPromo = $menu->promo && $menu->promo->is_active;
        return [
            'id' => $menu->id,
            'category_id' => $menu->category_id,
            'name' => $menu->name,
            'description' => $menu->description,
            'price' => $menu->price,
            'image' => $menu->image,
            'rating' => 4.8,
            'is_promo' => $hasPromo,
            'promo_price' => $hasPromo ? $menu->promo->promo_price : null,
        ];
    });

    $promos = Promos::where('is_active', true)->with('menu')->orderBy('created_at', 'desc')->get()->map(function ($promo) {
        return [
            'id' => $promo->id,
            'title' => $promo->title,
            'image' => $promo->image,
            'menu_id' => $promo->menu_id,
            'discount_type' => $promo->discount_type,
            'discount_value' => $promo->discount_value,
            'promo_price' => $promo->promo_price,
        ];
    });

    $galleries = Galleries::orderBy('created_at', 'desc')->get()->map(function ($gallery) {
        return [
            'id' => $gallery->id,
            'name' => $gallery->name,
            'image' => $gallery->image,
            'description' => 'Moment indah kebersamaan di Nugas Cafe',
        ];
    });

    return \Inertia\Inertia::render('welcome', [
        'categories' => $categories,
        'menus'      => $menus,
        'promos'     => $promos,
        'galleries'  => $galleries,
    ]);
})->name('home');

Route::get('/guest/menu', [GuestOrderController::class, 'index'])->name('guest.menu.index');
Route::post('/guest/menu', [GuestOrderController::class, 'store'])->name('guest.menu.store');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::prefix('admin')->group(function () {
        Route::resource('categories', CategoriesController::class)->names('categories');
        Route::resource('menus', MenusController::class)->names('menus');
        Route::resource('galleries', GalleriesController::class)->names('galleries');
        Route::resource('promos', PromosController::class)->names('promos');
        Route::resource('invoices', InvoicesController::class)->names('invoices');
        Route::resource('reservation-packages', ReservationPackagesController::class)->names('reservation-packages');
        Route::resource('reservations', ReservationsController::class)->names('reservations');
        Route::resource('reservation-members', ReservationMembersController::class)->names('reservation-members');
        Route::resource('reservation-items', ReservationItemsController::class)->names('reservation-items');
        Route::resource('tables', TablesController::class)->names('tables');
        Route::resource('table-orders', TableOrdersController::class)->names('table-orders');
        Route::resource('table-order-items', TableOrderItemsController::class)->names('table-order-items');
    });
});

require __DIR__ . '/settings.php';

