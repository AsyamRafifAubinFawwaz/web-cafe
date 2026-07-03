<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'name',
    'price',
    'price_type',
    'min_order_per_pax',
    'min_capacity',
    'max_capacity',
    'created_at',
    'updated_at',
    'deleted_at',
    'deleted_by'
])]
class ReservationPackages extends Model
{
    use SoftDeletes;

    protected $table = 'reservation_packages';

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
}
