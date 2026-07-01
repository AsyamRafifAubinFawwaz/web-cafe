<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReservationMembers;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationMembersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ReservationMembers::query();
        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        $reservationMembers = $query->orderBy('name', 'asc')->paginate(10);
        return Inertia::render('admin/reservation-members/index', [
            'reservationMembers' => $reservationMembers,
            'filters'            => $request->only(['search'])
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
            'name'           => 'required|string|max:255'
        ]);
        ReservationMembers::create($validated);
        return redirect()->back()->with('success', 'Member berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(ReservationMembers $reservationMembers)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ReservationMembers $reservationMembers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ReservationMembers $reservationMembers)
    {
        $validated = $request->validate([
            'reservation_id' => 'sometimes|integer|exists:reservations,id',
            'name'           => 'sometimes|string|max:255'
        ]);
        $reservationMembers->update($validated);
        return redirect()->back()->with('success', 'Member berhasil diupdate.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReservationMembers $reservationMembers)
    {
        $reservationMembers->delete();
        return redirect()->back()->with('success', 'Member berhasil dihapus.');
    }
}
