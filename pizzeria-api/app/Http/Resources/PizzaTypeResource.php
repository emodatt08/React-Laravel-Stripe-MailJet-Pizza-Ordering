<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PizzaTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'image' => asset('storage'.$this->image),
            'status' => $this->status,
            'created_at' =>  Carbon::parse($this->created_at)->format('m/d/Y'),
            'updated_at' =>  Carbon::parse($this->updated_at)->format('m/d/Y'),
        ];
    }
}
