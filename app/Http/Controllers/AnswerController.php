<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Inquiry;
use App\Models\Item;
use Illuminate\Http\Request;

class AnswerController extends Controller
{
    public function indexByItem(Item $item) {
        $answers = Answer::query()
            ->whereIn('inquiry_id', $item->inquiries()->pluck('id'))
            ->with('inquiry')
            ->get();

        return $answers->toResourceCollection();
    }

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
        $request->validate([
            'inquiry_id' => 'required|integer|exists:inquiries,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'store_name' => 'required|string|max:255',
            'store_address' => 'nullable|string|max:500',
            'additional_info' => 'nullable|string|max:1000',
        ]);

        $inquiry = Inquiry::findOrFail($request->input('inquiry_id'));
        $location = $this->createPoint($request->latitude, $request->longitude);

        if ($this->calculateDistanceMeters($location, $inquiry->location) > $inquiry->search_radius_meters) {
            return response()->json(['error' => 'Answer location is outside the search radius of the inquiry'], 400);
        }

        $answer = $inquiry->answers()->create([
            'user_id' => $request->user()->id,
            'store_name' => $request->store_name,
            'store_address' => $request->store_address,

            'location' => $location
        ]);

        return $answer->toResource();
    }

    /**
     * Display the specified resource.
     */
    public function show(Answer $answer)
    {
        return $answer->toResource();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Answer $answer)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'store_name' => 'required|string|max:255',
            'store_address' => 'nullable|string|max:500',
            'additional_info' => 'nullable|string|max:1000',
        ]);

        $location = $this->createPoint($request->latitude, $request->longitude);
        $request->merge(['user_id' => $request->user()->id, 'location' => $location]);

        $answer->update($request->all());

        return $answer->toResource();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Answer $answer)
    {
        return Answer::destroy($answer->id);
    }

    /**
     * Get answers made by the authenticated user.
     */
    public function myAnswers(Request $request)
    {
        return $request->user()->answers()->get()->toResourceCollection();
    }
}
