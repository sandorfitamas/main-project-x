<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{
    public function index($eventId)
    {
        return Review::with('user')->where('event_id', $eventId)->latest()->get();
    }

    public function recent()
    {
        return Review::with(['user', 'event'])->latest()->take(6)->get();
    }

    public function store(Request $request, $eventId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        if (Review::where('event_id', $eventId)->where('user_id', $request->user()->id)->exists()) {
            return response()->json(['success' => false, 'message' => 'Már értékelted ezt a helyszínt!'], 400);
        }

        $review = Review::create([
            'event_id' => $eventId,
            'user_id' => $request->user()->id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        return response()->json(['success' => true, 'review' => $review->load('user')]);
    }
}
