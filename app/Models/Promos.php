<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable([
    'menu_id',
    'title',
    'image',
    'discount_type',
    'discount_value',
    'promo_price',
    'is_active',
    'created_at',
    'updated_at',
    'deleted_at',
    'deleted_by'
])]
class Promos extends Model
{
    use SoftDeletes;

    protected $table = 'promos';


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

    public function menu()
    {
        return $this->belongsTo(Menus::class, 'menu_id');
    }
}
