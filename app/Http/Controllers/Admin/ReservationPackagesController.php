<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ReservationPackages;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationPackagesController extends Controller
{
      /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ReservationPackages::query();

         if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $reservationPackages = $query->orderBy('name', 'asc')->paginate(10)->withQueryString();

        return Inertia::render('admin/reservation-packages/index', [
            'reservationPackages' => $reservationPackages,
            'filters'             => $request->only(['search'])
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
            'name'              => 'required|string|max:255',
            'price'             => 'required|integer',
            'price_type'        => 'required|string',
            'min_order_per_pax' => 'required|integer',
            'min_capacity'      => 'required|integer',
            'max_capacity'      => 'required|integer'
        ]);

        ReservationPackages::create($validated);
        return redirect()->back()->with('success', 'Paket reservasi berhasil di tambahkan');

    }

      /**
     * Display the specified resource.
     */
    public function show(ReservationPackages $reservationPackages)
    {
          //
    }

      /**
     * Show the form for editing the specified resource.
     */
    public function edit(ReservationPackages $reservationPackages)
    {
          //
    }

      /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ReservationPackages $reservationPackages)
    {
        $validated = $request->validate([
            'name'              => 'sometimes|string|max:255',
            'price'             => 'sometimes|integer',
            'price_type'        => 'sometimes|string',
            'min_order_per_pax' => 'sometimes|integer',
            'min_capacity'      => 'sometimes|integer',
            'max_capacity'      => 'sometimes|integer'
        ]);

        $reservationPackages->update($validated);

        return redirect()->back()->with('success', 'Paket reservasi berhasil di update');
    }

      /**
     * Remove the specified resource from storage.
     */
    public function destroy(ReservationPackages $reservationPackages)
    {
        $reservationPackages->delete();
        return redirect()->back()->with('success', 'Paket reservasi berhasil dihapus');
    }
}
