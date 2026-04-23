<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use MatanYadaev\EloquentSpatial\Objects\Point;
use MatanYadaev\EloquentSpatial\Traits\HasSpatial;

class Answer extends Model
{
    use HasSpatial;

    protected $casts = [
        'location' => Point::class,
    ];

    protected $fillable = [
        'user_id',
        'inquiry_id',
        'location',
        'store_name',
        'store_address',
        'additional_info',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function inquiry()
    {
        return $this->belongsTo(Inquiry::class);
    }

    /**
     * Scope a query to only include answers within the given search radius of the given latitude and longitude.
     */
    public function scopeWhereLatLngWithinSearchRadius(Builder $query, $latitude, $longitude, $searchRadius): Builder
    {
        // Set the wkt here because we need to pass it as a parameter to the raw query, and we can't bind parameters inside quotes
        $wkt = "POINT($latitude $longitude)";
        return $query->whereRaw("ST_Distance_Sphere(location, ST_GeomFromText(?, 4326)) <= ?", [$wkt, $searchRadius]);
    }
}
