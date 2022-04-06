<?php
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length');
header('Access-Control-Allow-Origin: *');

use Illuminate\Support\Facades\Route;
  
use App\Http\Controllers\API\AuthController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login',[AuthController::class,'login']);
Route::post('register', [AuthController::class, 'register']);
Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/pizza_type', 'API\PizzaTypesController@index');
Route::get('/pizza_order', 'API\PizzaOrdersController@index');
Route::post('/pizza_order', 'API\PizzaOrdersController@store');
Route::post('/pizza_order/pay', 'API\PaymentsController@index');



Route::middleware('auth:sanctum')->group( function () {

    Route::group(['prefix' => 'pizza_order'], function(){     
        
        Route::get('/{id}', 'API\PizzaOrdersController@show');
        Route::put('/{id}', 'API\PizzaOrdersController@update');
        Route::delete('/{id}', 'API\PizzaOrdersController@delete');
    });

    

    Route::group(['prefix' => 'pizza_type'], function(){   
        Route::post('/image', 'API\PizzaTypesController@pizzaImageStore');  
       
        Route::get('/{id}', 'API\PizzaTypesController@show');
       
        Route::delete('/{id}', 'API\PizzaTypesController@delete');

        Route::post('/store', 'API\PizzaTypesController@store');

        Route::put('/{id}/update', 'API\PizzaTypesController@update');
    });
   
});
