<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


#[Fillable([
    'reservation_member_id',
    'menu_id',
    'quantity',
    'subtotal',
    'created_at',
    'updated_at',
    'deleted_at',
    'deleted_by'
])]
class ReservationItems extends Model
{
    use SoftDeletes;

    protected $table = 'reservation_items';

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
            }
        });
    }

    public function reservationMember()
    {
        return $this->belongsTo(ReservationMembers::class, 'reservation_member_id');
    }
    
    public function menu()
    {
        return $this->belongsTo(Menus::class, 'menu_id');
    }

}
