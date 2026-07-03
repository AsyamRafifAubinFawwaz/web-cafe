<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Galleries;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Pest\Plugins\Tia\Storage;

class GalleriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Galleries::query();

        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $galleries = $query->orderBy('name', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('admin/galleries/index', [
            'galleries' => $galleries,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'required|image|mimes:png,jpg,jpeg'
        ]);

        if($request->hasFile('image')){
            $validated['image'] = $request->file('image')->store('galleries', 'public');
        }

        Galleries::create($validated);

        return redirect()->back()->with('success', 'Gambar berhasil di tambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(Gallery $gallery)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Gallery $gallery)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Galleries $gallery, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'required|image|mimes:png,jpg,jpeg'
        ]);

        $gallery = Galleries::find($id);
        if($request->hasFile('image')){
            $validated['image'] = $request->file('image')->store('galleries', 'public');
        }

        $gallery->update($validated);

        return redirect()->back()->with('success', 'Gambar berhasil di update');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Galleries $gallery, $id)
    {
        $gallery = Galleries::find($id);

        if($gallery->image){
            Storage::disk('public')->delete($gallery->image);
        }

        $gallery->delete();

        return redirect()->back()->with('success', 'Gambar berhasil di hapus');
    }
}
