<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ItemController extends Controller
{
    /**
     * Get the list of items that are nearby
     */
    public function index(Request $request)
    {
        $category_id = $request->query('category_id');

        $current_input = $request->query('current_input');

        $items = DB::table('items');
        if ($category_id) {
            $items->where('category_id', $category_id);
        }

        if ($current_input) {
            $items->whereLike(['name', 'description'], "%$current_input%");
        }

        return $items->get();
    }

    public function show(Item $item)
    {
        return $item;
    }

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
