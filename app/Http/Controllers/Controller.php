<?php

namespace App\Http\Controllers;

use MatanYadaev\EloquentSpatial\Objects\Point;

abstract class Controller
{
    /**
     * Creates a point object with SRID 4326 for the given latitude and longitude.
     */
    static function createPoint($latitude, $longitude)
    {
        return new Point($latitude, $longitude, 4326);
    }
}
