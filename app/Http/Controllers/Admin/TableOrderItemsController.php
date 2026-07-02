<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TableOrderItems;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableOrderItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = TableOrderItems::query();

        if ($request->has('table_order_id') && $request->table_order_id != '') {
            $query->where('table_order_id', $request->table_order_id);
        }

        $tableOrderItems = $query->orderBy('table_order_id', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('admin/table-order-items/index', [
            'tableOrderItems' => $tableOrderItems,
            'filters' => $request->only(['table_order_id'])
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
            'table_order_id' => 'required|integer|exists:table_orders,id',
            'menu_id' => 'required|integer|exists:menus,id',
            'quantity' => 'required|integer',
            'subtotal' => 'required|integer',
        ]);

        TableOrderItems::create($validated);
        return redirect()->back()->with('success', 'Table Order Item berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TableOrderItems $tableOrderItem)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TableOrderItems $tableOrderItem)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TableOrderItems $tableOrderItem)
    {
        $validated = $request->validate([
            'table_order_id' => 'sometimes|integer|exists:table_orders,id',
            'menu_id' => 'sometimes|integer|exists:menus,id',
            'quantity' => 'sometimes|integer',
            'subtotal' => 'sometimes|integer',
        ]);

        $tableOrderItem->update($validated);
        return redirect()->back()->with('success', 'Table Order Item berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TableOrderItems $tableOrderItem)
    {
        $tableOrderItem->delete();
        return redirect()->back()->with('success', 'Table Order Item berhasil dihapus.');
    }
}
