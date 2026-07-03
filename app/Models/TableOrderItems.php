<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'table_order_id',
    'menu_id',
    'quantity',
    'subtotal',
    'created_at',
    'updated_at',
    'deleted_at',
    'deleted_by'
])]
class TableOrderItems extends Model
{
    use SoftDeletes;

    protected $table = 'table_order_items';

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (auth()->check()) {
                $model->created_by = auth()->id();
            }
        });

        static::updating(function ($model) {
            if (auth()->check()) {
                $model->updated_by = auth()->id();
            }
        });

        static::deleting(function ($model) {
            if (auth()->check()) {
                $model->deleted_by = auth()->id();
                $model->save();
            }
        });
    }

    public function tableOrder()
    {
        return $this->belongsTo(TableOrders::class, 'table_order_id');
    }

    public function menu()
    {
        return $this->belongsTo(Menus::class, 'menu_id');
    }
}
