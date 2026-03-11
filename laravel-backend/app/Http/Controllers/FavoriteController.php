<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $events = Event::join('favorites', 'events.id', '=', 'favorites.event_id')
            ->where('favorites.user_id', $userId)
            ->orderBy('favorites.created_at', 'desc')
            ->select('events.*')
            ->get();

        return response()->json([
            'success' => true,
            'events'  => $events->map(fn($e) => $e->toApiArray()),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate(['event_id' => 'required|integer|exists:events,id']);

        $userId  = $request->user()->id;
        $eventId = $request->event_id;

        $exists = Favorite::where('user_id', $userId)->where('event_id', $eventId)->exists();
        if ($exists) {
            return response()->json(['success' => false, 'error' => 'Már kedvenc'], 409);
        }

        Favorite::create(['user_id' => $userId, 'event_id' => $eventId]);

        return response()->json(['success' => true, 'message' => 'Kedvencekhez adva']);
    }

    public function destroy(Request $request, $eventId)
    {
        $userId = $request->user()->id;

        Favorite::where('user_id', $userId)->where('event_id', $eventId)->delete();

        return response()->json(['success' => true, 'message' => 'Eltávolítva a kedvencek közül']);
    }
}
