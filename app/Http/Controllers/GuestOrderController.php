<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TableOrders;
use App\Models\TableOrderItems;
use App\Models\Categories;
use App\Models\Menus;
use App\Models\Tables;

class GuestOrderController extends Controller
{
    /**
     * Show the public order page for a specific table
     */
    public function index(Request $request)
    {
        $tableId = $request->query('table_id');
        if (!$tableId) {
            return redirect('/')->with('error', 'Silakan scan QR Code dari meja Anda.');
        }

        $table = Tables::find($tableId);
        if (!$table) {
            return redirect('/')->with('error', 'Meja tidak ditemukan.');
        }

        $existingOrder = TableOrders::where('table_id', $tableId)
            ->whereIn('status', ['pending', 'cooking', 'served'])
            ->with('items.menu')
            ->first();

        $categories = Categories::all();
        $menus = Menus::with(['promo' => function($q) {
            $q->where('is_active', true);
        }])->get();

        return Inertia::render('guest/order', [
            'tableId' => $tableId,
            'tableNumber' => $table->table_number,
            'existingOrder' => $existingOrder,
            'categories' => $categories,
            'menus' => $menus,
        ]);
    }

    /**
     * Store items to the table order session
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required|exists:tables,id',
            'payment_method' => 'required|in:pay_at_cashier,online_payment',
            'items' => 'required|array|min:1',
            'items.*.menu_id' => 'required|exists:menus,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.subtotal' => 'required|integer|min:0',
            'total_amount' => 'required|integer|min:0'
        ]);

        // Find existing unpaid order or create new one
        $tableOrder = TableOrders::where('table_id', $validated['table_id'])
            ->whereIn('status', ['pending', 'cooking', 'served'])
            ->first();

        if (!$tableOrder) {
            $tableOrder = TableOrders::create([
                'table_id' => $validated['table_id'],
                'status' => 'pending',
                'payment_method' => $validated['payment_method'],
                'total_amount' => 0
            ]);
        } else {
            // If they had an existing order, update payment method just in case
            $tableOrder->payment_method = $validated['payment_method'];
        }

        foreach ($validated['items'] as $item) {
            TableOrderItems::create([
                'table_order_id' => $tableOrder->id,
                'menu_id' => $item['menu_id'],
                'quantity' => $item['quantity'],
                'subtotal' => $item['subtotal']
            ]);
        }

        $tableOrder->total_amount += $validated['total_amount'];
        $tableOrder->save();

        return back()->with('success', 'Pesanan berhasil dikirim ke dapur!');
    }
}
