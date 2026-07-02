<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReservationItems;
use App\Models\ReservationMembers;
use App\Models\Menus;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationItemsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ReservationItems::with(['reservationMember', 'menu']);

        if ($request->has('reservation_member_id') && $request->reservation_member_id != '') {
            $query->where('reservation_member_id', $request->reservation_member_id);
        }

        $reservationItems = $query->orderBy('reservation_member_id', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('admin/reservation-items/index', [
            'reservationItems'   => $reservationItems,
            'reservationMembers' => ReservationMembers::orderBy('name', 'asc')->get(),
            'menus'              => Menus::orderBy('name', 'asc')->get(),
            'filters'            => $request->only(['reservation_member_id'])
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
            'reservation_member_id' => 'required|integer|exists:reservation_members,id',
            'menu_id'               => 'required|integer|exists:menus,id',
            'quantity'              => 'required|integer',
            'subtotal'              => 'required|integer',
        ]);

        ReservationItems::create($validated);
        return redirect()->back()->with('success', 'Resvervasi Item berhasil di tambahkan');
    }

    /**
     * Display the specified resource.
     */
    public function show(ReservationItems $reservationItems)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ReservationItems $reservationItems)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ReservationItems $reservationItems)
    {
        $validated = $request->validate([
            'reservation_member_id' => 'sometimes|integer|exists:reservation_members,id',
            'menu_id'               => 'sometimes|integer|exists:menus,id',
            'quantity'              => 'sometimes|integer',
            'subtotal'              => 'sometimes|integer',
        ]);

        $reservationItems->update($validated);
        return redirect()->back()->with('success', 'Resvervasi Item berhasil di update');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReservationItems $reservationItems)
    {
        $reservationItems->delete();
        return redirect()->back()->with('success', 'Reservasi berhasil di hapus');
    }
}
