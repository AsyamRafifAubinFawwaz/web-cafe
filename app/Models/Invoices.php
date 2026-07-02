<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
#[Fillable([
    'reservation_id',
    'invoice_number',
    'payment_status',
    'payment_method',
    'issued_at',
    'paid_at',
    'created_at',
    'updated_at',
    'deleted_at',
    'deleted_by'
])]
class Invoices extends Model
{
    use SoftDeletes;

    protected $table = 'invoices';
    
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

    
    public function reservation()
    {
        return $this->belongsTo(Reservations::class, 'reservation_id');
    }

  
}
