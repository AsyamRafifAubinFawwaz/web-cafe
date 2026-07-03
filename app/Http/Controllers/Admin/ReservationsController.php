<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservations;
use App\Models\ReservationPackages;
use App\Models\Invoices;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Reservations::with(['reservationPackage', 'reservationMembers.reservationItems.menu']);

        if ($request->has('search') && $request->search != '') {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('status') && $request->status != '' && $request->status != 'all') {
            $query->where('status', $request->status);
        }

        $reservations = $query->orderBy('reservation_date', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('admin/reservations/index', [
            'reservations'        => $reservations,
            'reservationPackages' => ReservationPackages::orderBy('name', 'asc')->get(),
            'filters'             => $request->only(['search', 'status'])
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
            'name'             => 'sometimes|string|max:255',
            'phone'            => 'required|string|max:12',
            'reservation_date' => 'required|date|date_format:Y-m-d H:i:s',
            'package_id'       => 'required|integer|exists:reservation_packages,id',
            'status'           => 'nullable|string|in:pending,approved,invoiced,paid,completed,cancelled',
            'input_method'     => 'nullable|string|in:manual,room_link',
            'room_link_token'  => 'nullable|string|max:255',
            'total_amount'     => 'nullable|integer',
        ]);

        Reservations::create($validated);
        return redirect()->back()->with('success', 'Reservasi berhasil di tambahkan');
    }

    public function show(Reservations $reservations)
    {
        $reservations->load(['reservationPackage', 'reservationMembers.reservationItems.menu', 'invoice']);

        return Inertia::render('admin/reservations/show', [
            'reservation' => $reservations
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservations $reservations)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reservations $reservations)
    {
        $validated = $request->validate([
            'name'             => 'sometimes|string|max:255',
            'phone'            => 'sometimes|string|max:12',
            'reservation_date' => 'sometimes|date|date_format:Y-m-d H:i:s',
            'package_id'       => 'sometimes|integer|exists:reservation_packages,id',
            'status'           => 'nullable|string|in:pending,approved,invoiced,paid,completed,cancelled',
            'input_method'     => 'nullable|string|in:manual,room_link',
            'room_link_token'  => 'nullable|string|max:255',
            'total_amount'     => 'nullable|integer',
        ]);

        $oldStatus = $reservations->status;
        $reservations->update($validated);

        if (isset($validated['status']) && $validated['status'] === 'invoiced' && $oldStatus !== 'invoiced') {
            $invoiceNumber = 'INV-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));

            Invoices::create([
                'reservation_id' => $reservations->id,
                'invoice_number' => $invoiceNumber,
                'payment_status' => 'unpaid',
                'issued_at'      => now(),
            ]);
        }

        return redirect()->back()->with('success', 'Reservasi berhasil di update');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservations $reservations)
    {
        $reservations->delete();
        return redirect()->back()->with('success', 'Reservasi berhasil di hapus');
    }
}
