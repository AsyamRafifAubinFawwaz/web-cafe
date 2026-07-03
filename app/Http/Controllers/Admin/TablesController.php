<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tables;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TablesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Tables::query();
        if ($request->has('search') && $request->search != '') {
            $query->where('table_number', 'like', '%' . $request->search . '%');
        }
        $tables = $query->orderBy('id', 'desc')->paginate(10)->withQueryString();
        
        return Inertia::render('admin/tables/index', [
            'tables' => $tables,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_number' => 'required|string|max:255|unique:tables,table_number',
        ]);

        Tables::create($validated);
        return redirect()->back()->with('success', 'Meja berhasil ditambahkan.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tables $table)
    {
        $validated = $request->validate([
            'table_number' => 'required|string|max:255|unique:tables,table_number,' . $table->id,
        ]);

        $table->update($validated);
        return redirect()->back()->with('success', 'Meja berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tables $table)
    {
        $table->delete();
        return redirect()->back()->with('success', 'Meja berhasil dihapus.');
    }
}
