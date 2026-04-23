<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ItemController extends Controller
{
    public function show(Item $item)
    {
        return $item;
    }

    /**
     * Get item suggestions based on the input query.
     */
    public function suggestions(Request $request)
    {
        $input = $request->query('input');

        if (!$input) {
            return response()->json(['error' => 'input query parameter is required'], 400);
        }

        // Get items that match the input in name or description, limit to 5 results
        $suggestions = Item::where('name', 'like', "%$input%")
            ->orWhere('description', 'like', "%$input%")
            ->limit(5)
            ->get();

        // Return only names and ids for suggestions, or empty array if no matches
        $suggestions = $suggestions->map(function ($item) {
            return ['id' => $item->id, 'name' => $item->name];
        });

        return response()->json(['data' => $suggestions]);
    }
}
