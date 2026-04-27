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

    /**
     * Calculates the distance in meters between two points using the Haversine formula.
     */
    static function calculateDistanceMeters(Point $point1, Point $point2)
    {
        // Haversine formula to calculate distance in meters between two points
        $earthRadius = 6371000; // Earth radius in meters

        $latFrom = deg2rad($point1->latitude);
        $lonFrom = deg2rad($point1->longitude);
        $latTo = deg2rad($point2->latitude);
        $lonTo = deg2rad($point2->longitude);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
            cos($latFrom) * cos($latTo) *
            sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return round($earthRadius * $c);
    }
}
