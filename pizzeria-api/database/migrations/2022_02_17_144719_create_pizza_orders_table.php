<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePizzaOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pizza_orders', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('pizza_type_id')->unsigned();
            $table->bigInteger('quantity');
            $table->string('phone',20);
            $table->string('residential_address');
            $table->string('location');
            $table->foreign('pizza_type_id')->references('id')->on('pizza_types')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pizza_orders');
    }
}
