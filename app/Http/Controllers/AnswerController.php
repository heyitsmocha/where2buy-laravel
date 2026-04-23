<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Inquiry;
use App\Models\Item;
use Illuminate\Http\Request;

class AnswerController extends Controller
{
    /**
     * Display the answers for a given inquiry.
     */
    public function indexByInquiry(Inquiry $inquiry)
    {
        return $inquiry->answers()->get()->toResourceCollection();
    }

    /**
     * Display the answers for a given item that are within the specified range.
     */
    public function indexByProximity(Request $request, Item $item) {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'range' => 'required|numeric',
        ]);

        $latitude = $request->query('latitude');
        $longitude = $request->query('longitude');
        $range = $request->query('range');

        // Find answers for the item that are within the specified range
        $answers = Answer::query()
            ->whereIn('inquiry_id', $item->inquiries()->pluck('id'))
            ->whereLatLngWithinSearchRadius($latitude, $longitude, $range)
            ->get();

        return $answers->toResourceCollection();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
