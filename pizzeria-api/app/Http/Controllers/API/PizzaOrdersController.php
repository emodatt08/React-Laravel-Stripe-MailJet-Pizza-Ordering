<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\API\CentreController as CentreController;
use App\Http\Resources\PizzaOrderResource;
use App\Jobs\SendFulfilmentEmailJob;
use App\PizzaOrder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PizzaOrdersController extends CentreController
{
     /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $pizza_types = PizzaOrder::latest()->paginate(5);
        return  $this->returnSuccessResponse(PizzaOrderResource::collection($pizza_types)->response()->getData(true), "Success");
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'phone'  => 'required|numeric',
            'pizza_type_id' => 'required',
            'full_name' => 'required|max:50',
            'residential_address' => 'required|max:100',
            'location' => 'required|max:180',
            'quantity' => 'required|numeric',
            'total_price' => 'required|numeric',
            'email'=>'required',
            'latitude' => 'required',
            'longitude' => 'required',
            'quantity' => 'required|regex:/^\d+(\.\d{1,2})?$/|min:1|max:10'
        ]);
        if($validator->fails()){
            return $this->returnErrorResponse($validator->errors());       
        }
        $pizza = PizzaOrder::create($input);
        return $this->returnSuccessResponse(new PizzaOrderResource($pizza), 'Pizza order created.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $pizza = PizzaOrder::find($id);
        if (is_null($pizza)) {
            return $this->returnErrorResponse('Pizza order does not exist.');
        }
        return $this->returnSuccessResponse(new PizzaOrderResource($pizza), 'Pizza Order fetched.');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        Log::info("Update Id ". json_encode($id));
        $input = $request->all();
        Log::info("Update info ". json_encode($input));
        $pizza = PizzaOrder::find($id);
        $pizza->fulfilment = $input['fulfil'];
        $pizza->decline_note = $input['declineNote'] ?? "";
        $email =  $pizza->email;
        
        if($pizza->save()){
            dispatch(new SendFulfilmentEmailJob($pizza, $email));
            return $this->returnSuccessResponse(new PizzaOrderResource($pizza), 'Pizza order Done.');
        }else{
            return $this->returnErrorResponse('Pizza order not fulfilled.');
        }
        
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(PizzaOrder $order)
    {
        $order->delete();
        return $this->returnSuccessResponse([], 'Pizza order deleted.');
    }
}
