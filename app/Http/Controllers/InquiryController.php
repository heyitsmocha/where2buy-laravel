<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use App\Models\Item;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    /**
     * Display a list of inquiries that are near the user's location.
     */
    public function index(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);
        $latitude = $request->query('latitude');
        $longitude = $request->query('longitude');
        // $country = $request->query('country');

        $country = 'USA'; // Example country

        $inquiries = Inquiry::query()
            ->whereLatLngWithinDistance($latitude, $longitude)
            ->with('item')
            ->get();

        return $inquiries->map(function ($inquiry) {
            return [
                'id' => $inquiry->id,
                'item_name' => $inquiry->item->name,
                'item_description' => $inquiry->item->description ?? null,
            ];
        });
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            // Data for the inquiry
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'search_radius_meters' => 'required|integer|min:0|max:80000',
            'anywhere' => 'boolean',
            'same_country_only' => 'boolean',

            // If item_id is not provided, name is required to create/find item
            'item_id' => 'required_without:name|integer|exists:items,id',
            'name' => 'required_without:item_id|string|max:255',
            'description' => 'nullable|string',
        ]);

        // If item_id is provided, use it. Otherwise, create/find item by name.
        if ($request->filled('item_id')) {
            $item = Item::findOrFail($request->input('item_id'));
        } elseif ($request->filled('name')) {
            $item = Item::firstOrCreate(
                ['name' => $request->input('name')],
                ['description' => $request->input('description', '')]
            );
        } else {
            abort(400, 'Either item_id or name must be provided.');
        }

        // Create the inquiry with the item_id
        $inquiry = $request->user()->inquiries()->create([
            'item_id' => $item->id,
            'location' => $this->createPoint($request->input('latitude'), $request->input('longitude')),
            'search_radius_meters' => $request->input('search_radius_meters'),

            'anywhere' => $request->input('anywhere', false),
            'same_country_only' => $request->input('same_country_only', true)
        ]);
        return $inquiry;
    }

    /**
     * Display the specified resource.
     */
    public function show(Inquiry $inquiry)
    {
        return $inquiry;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Inquiry $inquiry)
    {
        $inquiry->update($request->all());
        return $inquiry;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Inquiry $inquiry)
    {
        return Inquiry::destroy($inquiry->id);
    }

    public function answers(Inquiry $inquiry) {
        return $inquiry->answers;
    }

    /**
     * Get inquiries made by the authenticated user.
     */
    public function myInquiries(Request $request)
    {
        return $request->user()->inquiries()->get()->map(function ($inquiry) {
            return [
                'id' => $inquiry->id,
                'created_at' => $inquiry->created_at,
                'item_name' => $inquiry->item->name,
                'item_description' => $inquiry->item->description ?? null,
                'location' => [
                    'latitude' => $inquiry->location->latitude,
                    'longitude' => $inquiry->location->longitude,
                ],
                'search_radius_meters' => $inquiry->search_radius_meters,
            ];
        });
    }
}
