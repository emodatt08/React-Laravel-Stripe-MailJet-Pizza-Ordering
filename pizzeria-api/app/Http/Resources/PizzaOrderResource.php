<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PizzaTypeResource;

class PizzaOrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        //dd($this->pizza_types->first());
        // return parent::toArray($request);
        return [
           
                'id' => $this->id,
                'full_name' => $this->full_name,
                'total_price' => $this->total_price,
                'quantity' => $this->quantity,
                'phone' => $this->phone,
                'residential_address' => $this->residential_address,
                'location' => $this->location,
                'email' => $this->email,
                'latitude' => $this->latitude,
                'longitude' => $this->longitude,
                'payment' => $this->payment,
                'fulfilment' => $this->fulfilment,
                'decline_note' => $this->decline_note,
                'pizza_type' => new PizzaTypeResource($this->pizza_type),
                'created_at' => $this->created_at->format('m/d/Y'),
                'updated_at' => $this->updated_at->format('m/d/Y')
        ];
    }

    public function toResponse($request)
    {
        return JsonResource::toResponse($request);
    }
}
