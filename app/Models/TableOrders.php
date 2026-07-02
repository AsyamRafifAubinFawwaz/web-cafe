<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
#[Fillable([
    'table_number',
    'status',
    'payment_method',
    'total_amount',
    'created_at',
    'updated_at',
    'deleted_at',
    'deleted_by'
])]
class TableOrders extends Model
{
    use SoftDeletes;

    protected $table = 'table_orders';
    
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

    public function tableOrderItems()
    {
        return $this->hasMany(TableOrderItems::class, 'table_order_id');
    }
}
