<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TableOrders;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableOrdersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = TableOrders::query();
        if ($request->has('search') && $request->search != '') {
            $query->where('table_number', 'like', '%' . $request->search . '%');
        }
        $tableOrders = $query->orderBy('table_number', 'asc')->paginate(10)->withQueryString();
        return Inertia::render('admin/table-orders/index', [
            'tableOrders' => $tableOrders,
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
            'table_number' => 'required|string|max:255',
            'status' => 'required|in:pending,cooking,served,paid',
            'payment_method' => 'required|in:pay_at_cashier,online_payment',
            'total_amount' => 'required|integer',
        ]);

        TableOrders::create($validated);
        return redirect()->back()->with('success', 'Table Order berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(TableOrders $tableOrders)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TableOrders $tableOrders)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TableOrders $tableOrder)
    {
        $validated = $request->validate([
            'table_number' => 'sometimes|string|max:255',
            'status' => 'sometimes|in:pending,cooking,served,paid',
            'payment_method' => 'sometimes|in:pay_at_cashier,online_payment',
            'total_amount' => 'sometimes|integer',
        ]);

        $tableOrder->update($validated);
        return redirect()->back()->with('success', 'Table Order berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TableOrders $tableOrder)
    {
        $tableOrder->delete();
        return redirect()->back()->with('success', 'Table Order berhasil dihapus.');
    }
}
