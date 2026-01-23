<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use MatanYadaev\EloquentSpatial\Objects\Point;

class Inquiry extends Model
{
    protected $casts = [
        'anywhere' => 'boolean',
        'same_country_only' => 'boolean',
        'location' => Point::class,
    ];

    protected $fillable = [
        'user_id',
        'location',
        'search_radius_meters',
        'anywhere',
        'same_country_only',
        'item_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function answers()
    {
        return $this->hasMany(Answer::class);
    }
}
