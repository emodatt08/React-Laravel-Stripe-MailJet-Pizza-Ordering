<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pizza_orders', function (Blueprint $table) {
            $table->boolean('payment', ['0', '1', '2','3'])->default('0')->nullable()->comments('0 for pending, 1 for success, 2 for failure, 3 for retry');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pizza_orders', function (Blueprint $table) {
            //
            $table->boolean('payment');
        });
    }
}
