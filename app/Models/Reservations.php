<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;



#[Fillable([
    'name',
    'phone',
    'reservation_date',
    'package_id',
    'status',
    'input_method',
    'room_link_token',
    'total_amount',
    'created_at',
    'updated_at',
    'deleted_at',
    'deleted_by'
])]
class Reservations extends Model
{
    use SoftDeletes;
    
    protected $table = 'reservations';

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model){
            if(auth()->check()){
                $model->created_by = auth()->id();
            }
        });

        static::updating(function ($model){
            if(auth()->check()){
                $model->updated_by = auth()->id();
            }
        });

        static::deleting(function ($model){
            if (auth()->check()){
                $model->deleted_by = auth()->id();
                $model->save();
            }
        });
    }

    public function reservationPackage()
    {
        return $this->belongsTo(ReservationPackages::class, 'package_id');
    }

    public function reservationMembers()
    {
        return $this->hasMany(ReservationMembers::class, 'reservation_id');
    }

    public function invoice()
    {
        return $this->hasOne(Invoices::class, 'reservation_id');
    }
}
