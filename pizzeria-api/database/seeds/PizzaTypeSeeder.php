<?php

use App\PizzaType;
use Illuminate\Database\Seeder;

class PizzaTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $pizza_types = [
            [
                "id" => 1,
                "name"=> "Margherita",
                "image"=>"/Icons/pepperoni.jpg",
                "price"=> 56.00
            ],
            [
                "id" => 2,
                "name"=> "Chicken Delight",
                "image"=> "/Icons/margherita.jpg",
                "price"=>79
            ],
            [
                "id" => 3,
                "name"=> "Chicken Supreme",
                "image"=>"/Icons/vegan.jpg",
                "price"=> 34
            ],
            [
                "id" => 4,
                "name"=> "Flaming Chicken",
                "image"=>"/Icons/pineapple.jpg",
                "price"=> 73
            ],
            [
                "id" => 5,
                "name"=> "Hawaiian",
                "image"=>"/Icons/expensive.jpg",
                "price"=> 45
            ]
            ];

            foreach($pizza_types as $pizza_type){
                PizzaType::updateOrInsert(['id' => $pizza_type['id']], $pizza_type);
            }           
    }
}
