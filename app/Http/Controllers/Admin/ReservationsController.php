<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservations;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Reservations::query();

        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%');
            $query->orWhere('phone', 'like', '%' . $request->search . '%');
        }

        $reservations = $query->orderBy('reservation_date', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('admin/reservations/index', [
            'reservations' => $reservations,
            'filters'      => $request->only(['search'])
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

    /**
     * Display the specified resource.
     */
    public function show(Reservations $reservations)
    {
        //
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

        $reservations->update($validated);
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
