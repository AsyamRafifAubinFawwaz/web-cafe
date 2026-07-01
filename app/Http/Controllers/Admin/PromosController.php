<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Promos;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PromosController extends Controller
{
    public function index(Request $request)
    {
        $query = Promos::query();

        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $promos = $query->orderBy('title', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('admin/promos/index', [
            'promos'  => $promos,
            'filters' => $request->only(['search', 'type'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'image'          => 'required|image|mimes:jpg,jpeg,png',
            'discount_type'  => 'required|string',
            'discount_value' => 'required|integer',
            'promo_price'    => 'required|integer',
            'is_active'      => 'required|boolean',
            'menu_id'        => 'required|integer|exists:menus,id',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('menus', 'public');
        }

        Promos::create($validated);

        return redirect()->back()->with('success', 'Menu berhasil di tambahkan.');
    }


    public function update(Request $request, Promos $promo)
    {
        $validated = $request->validate([
            'title'          => 'sometimes|string|max:255',
            'image'          => 'sometimes|image|mimes:jpg,jpeg,png',
            'discount_type'  => 'sometimes|string',
            'discount_value' => 'sometimes|integer',
            'promo_price'    => 'sometimes|integer',
            'is_active'      => 'sometimes|boolean',
            'menu_id'        => 'sometimes|integer|exists:menus,id',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('menus', 'public');
        }

        $promo->update($validated);

        return redirect()->route('admin.menus.index')->with('success', 'Menu updated successfully.');
    }

    public function destroy(Promos $promo, $id)
    {
        $promo = Promos::find($id);
        if ($promo->image) {
            Storage::disk('public')->delete($promo->image);
        }
        $promo->delete();
        return redirect()->back()->with('success', 'Menu deleted successfully.');
    }
}
