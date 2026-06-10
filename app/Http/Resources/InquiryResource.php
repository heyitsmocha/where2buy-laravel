<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InquiryResource extends JsonResource
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
            'item_id' => $this->item_id,
            'item_name' => $this->item->name,
            'item_description' => $this->item->description ?? null,
            'latitude' => $this->location->latitude,
            'longitude' => $this->location->longitude,
            'search_radius_meters' => $this->search_radius_meters,
            'answers' => AnswerResource::collection($this->whenLoaded('answers')),
        ];
    }
}
