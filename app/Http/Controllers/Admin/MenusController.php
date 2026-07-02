<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categories;
use Illuminate\Http\Request;
use App\Models\Menus;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class MenusController extends Controller
{
    public function index(Request $request)
    {
        $query = Menus::with('category');

        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        if ($request->has('type') && in_array($request->type, ['makanan', 'minuman'])) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('type', $request->type);
            });
        }

        $menus = $query->orderBy('name', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('admin/menus/index', [
            'menus'      => $menus,
            'categories' => Categories::orderBy('name', 'asc')->get(),
            'filters'    => $request->only(['search', 'type'])
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'required|string',
            'price'       => 'required|integer',
            'image'       => 'required|image|mimes:jpg,jpeg,png',
            'category_id' => 'required|integer|exists:categories,id',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('menus', 'public');
        }

        Menus::create($validated);

        return redirect()->route('admin.menus.index')->with('success', 'Menu created successfully.');
    }

    public function update(Request $request, Menus $menu)
    {
        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price'       => 'sometimes|integer',
            'image'       => 'sometimes|image|mimes:jpg,jpeg,png',
            'category_id' => 'sometimes|integer|exists:categories,id',
        ]);

        if ($request->hasFile('image')) {
            if ($menu->image) {
                Storage::disk('public')->delete($menu->image);
            }
            $validated['image'] = $request->file('image')->store('menus', 'public');
        }

        $menu->update($validated);

        return redirect()->back()->with('success', 'Menu updated successfully.');
    }

    public function destroy($id)
    {
        $menu = Menus::find($id);
        if ($menu->image) {
            Storage::disk('public')->delete($menu->image);
        }
        $menu->delete();
        return redirect()->back()->with('success', 'Menu deleted successfully.');
    }
}
