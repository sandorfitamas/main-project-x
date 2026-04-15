<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Event;

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

        $event = Event::findOrFail($eventId);
        if ($event->user_id === $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'A saját eseményedet nem értékelheted!'], 400);
        }

        if (Review::where('event_id', $eventId)->where('user_id', $request->user()->id)->exists()) {
            return response()->json(['success' => false, 'message' => 'Már értékelted ezt a helyszínt!'], 400);
        }

        $review = Review::create([
            'event_id' => $eventId,
            'user_id' => $request->user()->id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        $realAvg = Review::where('event_id', $eventId)->avg('rating') ?: 0;
        $realCount = Review::where('event_id', $eventId)->count();
        
        $baseRating = $event->base_rating; // Csak a tényleges, seed-ből kapott értéket nézzük (a dinamikussal ne vegyítsük)
        
        // Ha az eseménynek nincs kezdeti értékelése (azaz új, null vagy 0), akkor csak a valódi átlagot vesszük
        if ($baseRating === null || (float)$baseRating === 0.0) {
            $averageRating = round($realAvg, 1);
        } else {
            $baseWeight = 5; // A kezdeti értékelés súlya (5 fiktív ember)
            $averageRating = (($baseRating * $baseWeight) + ($realAvg * $realCount)) / ($baseWeight + $realCount);
            $averageRating = round($averageRating, 1);
        }

        $event->update(['rating' => $averageRating]);

        return response()->json([
            'success' => true, 
            'review' => $review->load('user'),
            'new_average' => $averageRating
        ]);
    }
}
