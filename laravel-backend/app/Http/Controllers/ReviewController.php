<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Event;

/**
 * Class ReviewController
 * Esemény értékelések kezeléséért felelős controller.
 */

class ReviewController extends Controller
{
    /**
     * Egy eseményhez tartozó értékelések listázása.
     * @param int $eventId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index($eventId)
    {
        $reviews = Review::with('user')
            ->where('event_id', $eventId)
            ->latest()
            ->get();
        return response()->json([
            'success' => true,
            'reviews' => $reviews
        ]);
    }

    /**
     * Legutóbbi értékelések lekérdezése.
     * @return \Illuminate\Http\JsonResponse
     */
    public function recent()
    {
        $reviews = Review::with(['user', 'event'])
            ->latest()
            ->take(6)
            ->get();
        return response()->json([
            'success' => true,
            'reviews' => $reviews
        ]);
    }

    /**
     * Új értékelés létrehozása egy eseményhez.
     * @param Request $request
     * @param int $eventId
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, $eventId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $event = Event::findOrFail($eventId);
        $userId = $request->user()->id;

        if ($event->user_id === $userId) {
            return response()->json([
                'success' => false,
                'message' => 'A saját eseményedet nem értékelheted!'
            ], 400);
        }

        if (Review::where('event_id', $eventId)->where('user_id', $userId)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Már értékelted ezt a helyszínt!'
            ], 400);
        }

        $review = Review::create([
            'event_id' => $eventId,
            'user_id' => $userId,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        $realAverage = Review::where('event_id', $eventId)->avg('rating') ?: 0;
        $realCount = Review::where('event_id', $eventId)->count();
        $baseRating = $event->base_rating;

        // Ha az eseménynek nincs kezdeti értékelése (új, null vagy 0), akkor csak a valódi átlagot vesszük
        if ($baseRating === null || (float)$baseRating === 0.0) {
            $averageRating = round($realAverage, 1);
        } else {
            $baseWeight = 5; // A kezdeti értékelés súlya (5 fiktív ember)
            $averageRating = (($baseRating * $baseWeight) + ($realAverage * $realCount)) / ($baseWeight + $realCount);
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
