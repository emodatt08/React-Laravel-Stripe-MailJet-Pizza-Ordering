<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\API\CentreController as CentreController;
use App\Http\Resources\PizzaTypeResource;
use App\PizzaType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PizzaTypesController extends CentreController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $pizza_types = PizzaType::latest()->paginate(5);;
        return $this->returnSuccessResponse(PizzaTypeResource::collection($pizza_types)->response()->getData(true), 'Pizza Types Retrieved');
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
            'name'  => 'required|max:120',
            'price' => 'required|min:5|max:100'
        ]);
        
        if($validator->fails()){
            return $this->returnErrorResponse($validator->errors());       
        }

        $pizza = PizzaType::create($input);
        return $this->returnSuccessResponse(new PizzaTypeResource($pizza), 'Pizza Type created.');
    }

   public function pizzaImageStore(Request $request)
    {
        $input = $request->all();
        $validator = Validator::make($input, [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        
        if($validator->fails()){
            return $this->returnErrorResponse($validator->errors());       
        }

        $image = $request->file('image');
        $name = time().'.'.$image->getClientOriginalExtension();
        $destinationPath = public_path('/storage/Icons');
        $image->move($destinationPath, $name);
        return $this->returnSuccessResponse("/Icons/".$name, 'Image uploaded.');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $pizza = PizzaType::find($id);
        if (is_null($pizza)) {
            return $this->returnErrorResponse('Pizza type does not exist.');
        }
        return $this->sendResponse(new PizzaTypeResource($pizza), 'Pizza Type fetched.');
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
        $input = $request->all();
        $validator = Validator::make($input, [
            'name'  => 'required|max:120',
            'price' => 'required',
           
        ]);
        if($validator->fails()){
            return $this->returnErrorResponse($validator->errors());       
        }
        $pizza = PizzaType::find($id);
        $pizza->name = $input['name'];
        $pizza->price = $input['price'];
        $pizza->description = $input['description'];
        $pizza->image = $input['image'];
        $pizza->status = $input['status'];
       
        $pizza->save();
        
        return $this->returnSuccessResponse(new PizzaTypesController($pizza), 'Pizza type updated.');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $pizza = PizzaType::find($id)->delete();
        if ($pizza) {
            return $this->returnErrorResponse('Pizza type does not exist.');
        }
        return $this->returnSuccessResponse([], 'Pizza type deleted.');
    }
}
