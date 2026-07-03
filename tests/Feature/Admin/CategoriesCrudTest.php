<?php

use App\Models\User;
use App\Models\Categories;
use App\Models\Menus;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->withoutMiddleware([
        \Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class
    ]);
});

test('guests are redirected to the login page from categories admin', function () {
    $response = $this->get(route('categories.index'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit categories admin index', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('categories.index'));
    $response->assertOk();
});

test('authenticated users can create a new category', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('categories.store'), [
        'name' => 'Coffee Blend',
        'type' => 'minuman',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('categories', [
        'name' => 'Coffee Blend',
        'type' => 'minuman',
        'created_by' => $user->id,
    ]);
});

test('authenticated users can update an existing category', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Categories::create([
        'name' => 'Dessert',
        'type' => 'makanan',
    ]);

    $response = $this->put(route('categories.update', $category->id), [
        'name' => 'Super Dessert',
        'type' => 'makanan',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('categories', [
        'id' => $category->id,
        'name' => 'Super Dessert',
        'type' => 'makanan',
        'updated_by' => $user->id,
    ]);
});

test('authenticated users can soft delete a category with no menus', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Categories::create([
        'name' => 'Main Course',
        'type' => 'makanan',
    ]);

    $response = $this->delete(route('categories.destroy', $category->id));

    $response->assertRedirect();
    $this->assertSoftDeleted('categories', [
        'id' => $category->id,
    ]);

    // Memeriksa deleted_by terekam
    $deletedCategory = Categories::withTrashed()->find($category->id);
    expect($deletedCategory->deleted_by)->toBe($user->id);
});

test('authenticated users cannot delete a category if it has menus (ON DELETE RESTRICT)', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $category = Categories::create([
        'name' => 'Juices',
        'type' => 'minuman',
    ]);

    // Membuat menu yang terhubung ke kategori ini
    Menus::create([
        'category_id' => $category->id,
        'name' => 'Orange Juice',
        'price' => 15000,
    ]);

    $response = $this->delete(route('categories.destroy', $category->id));

    // Harus set session error dan tidak ter-softdelete
    $response->assertSessionHas('error');
    $this->assertDatabaseHas('categories', [
        'id' => $category->id,
        'deleted_at' => null,
    ]);
});
