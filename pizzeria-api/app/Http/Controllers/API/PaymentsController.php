<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\API\CentreController as CentreController;
use App\PizzaOrder;
use Illuminate\Support\Facades\Log;

class PaymentsController extends CentreController
{

    /**
     * success response method.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        
        \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));
        Log::info('payment request: '.json_encode($request->all()));
        $makepayment =  \Stripe\PaymentIntent::create ([
                    "amount" => $request->price,
                    "currency" => "usd",
                    "payment_method" => $request->stripeToken,
                    "confirm" => true,
                    "description" => "Test payment from sadatspizzeria.com." 
            ]);
            Log::info('payment response: '. json_encode($makepayment));

        if($makepayment){
            PizzaOrder::find($request->order_id)->update(['payment' => '1']);
            return  $this->returnSuccessResponse($makepayment, "Success");
        }else{
            PizzaOrder::find($request->order_id)->update(['payment' => '2']);
        }
        
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
