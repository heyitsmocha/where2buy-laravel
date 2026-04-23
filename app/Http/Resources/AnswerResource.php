<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnswerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'created_at' => $this->created_at,
            'latitude' => $this->location->latitude,
            'longitude' => $this->location->longitude,
            'store_name' => $this->store_name,
            'store_address' => $this->store_address,
            'additional_info' => $this->additional_info,
        ];
    }
}
