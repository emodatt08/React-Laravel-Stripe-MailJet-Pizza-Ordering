<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PizzaOrder extends Model
{
    protected $fillable = [
        'quantity',
        'phone',
        'full_name',
        'residential_address',
        'total_price',
        'quantity',
        'location',
        'pizza_type_id',
        'email',
        'longitude',
        'latitude',
        'fulfilment'
    ];

    protected $casts = ['latitude' => 'double', 'longitude' => 'double'];

    public function pizza_type(){
        return $this->hasOne('\App\PizzaType', 'id', 'pizza_type_id');
    }
}
