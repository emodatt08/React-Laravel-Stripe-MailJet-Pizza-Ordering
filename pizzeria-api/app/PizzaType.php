<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PizzaType extends Model
{

    protected $fillable = [
        "id",
        "name",
        "image",
        "status",
        "description",
        "price"
    ];
    
    
    public function pizza_orders(){
        return $this->hasMany(PizzaOrder::class, 'id', 'pizza_type_id');
    }
}
