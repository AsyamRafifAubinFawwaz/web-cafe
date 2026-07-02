<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invoices;
use App\Models\Reservations;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoicesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Invoices::query();
        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        $invoices = $query->orderBy('name', 'asc')->paginate(10);
        return Inertia::render('admin/invoices/index', [
            'invoices' => $invoices,
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
            'reservation_id' => 'required|integer|exists:reservations,id',
            'invoice_number' => 'required|string|max:255',
            'payment_status' => 'required|in:unpaid,paid',
            'payment_method' => 'required|in:transfer,cash,qris',
            'issued_at'      => 'required|date',
            'paid_at'        => 'nullable|date',
        ]);

        Invoices::create($validated);
        return redirect()->back()->with('success', 'Invoice berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoices $invoices)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoices $invoices)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Invoices $invoices)
    {
        $validated = $request->validate([
            'reservation_id' => 'required|integer|exists:reservations,id',
            'invoice_number' => 'required|string|max:255',
            'payment_status' => 'required|in:unpaid,paid',
            'payment_method' => 'required|in:transfer,cash,qris',
            'issued_at'      => 'required|date',
            'paid_at'        => 'nullable|date',
        ]);

        $invoices->update($validated);
        return redirect()->back()->with('success', 'Invoice berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoices $invoices)
    {
        $invoices->delete();
        return redirect()->back()->with('success', 'Invoice berhasil dihapus.');
    }
}
