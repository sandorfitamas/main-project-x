<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::orderBy('date')->orderBy('time')->get();

        return response()->json([
            'success' => true,
            'events'  => $events->map(fn($e) => $e->toApiArray()),
        ]);
    }

    public function show($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['success' => false, 'error' => 'Esemény nem található'], 404);
        }

        return response()->json(['success' => true, 'event' => $event->toApiArray()]);
    }

    public function myEvents(Request $request)
    {
        $events = Event::where('user_id', $request->user()->id)
            ->orderBy('date')
            ->orderBy('time')
            ->get();

        return response()->json([
            'success' => true,
            'events'  => $events->map(fn($e) => $e->toApiArray()),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'    => 'required|string|max:255',
            'date'     => 'required|date',
            'time'     => 'required',
            'location' => 'required|string|max:255',
        ], [
            'title.required'    => 'Az esemény neve kötelező',
            'date.required'     => 'A dátum megadása kötelező',
            'time.required'     => 'Az időpont megadása kötelező',
            'location.required' => 'A helyszín megadása kötelező',
        ]);

        $tags = $request->input('tags', []);
        if (is_array($tags)) {
            $tags = implode(',', $tags);
        }

        $event = Event::create([
            'title'         => $request->title,
            'description'   => $request->description ?? '',
            'rating'        => $request->rating ?? 0.0,
            'date'          => $request->date,
            'time'          => $request->time,
            'location'      => $request->location,
            'image_url'     => $request->imageUrl ?? '',
            'category'      => $request->category ?? 'Egyéb',
            'organizer'     => $request->organizer ?? '',
            'user_id'       => $request->user()->id,
            'tags'          => $tags,
            'price'         => $request->price ?? '',
            'contact_phone' => $request->contact_phone ?? '',
        ]);

        return response()->json(['success' => true, 'id' => $event->id], 201);
    }

    public function update(Request $request, $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['success' => false, 'error' => 'Esemény nem található'], 404);
        }

        if ($event->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'error' => 'Nincs jogosultságod módosítani ezt az eseményt'], 403);
        }

        $request->validate([
            'title'    => 'required|string|max:255',
            'date'     => 'required|date',
            'time'     => 'required',
            'location' => 'required|string|max:255',
        ]);

        $tags = $request->input('tags', []);
        if (is_array($tags)) {
            $tags = implode(',', $tags);
        }

        $event->update([
            'title'         => $request->title,
            'description'   => $request->description ?? $event->description,
            'rating'        => $request->rating ?? $event->rating,
            'date'          => $request->date,
            'time'          => $request->time,
            'location'      => $request->location,
            'image_url'     => $request->imageUrl ?? $event->image_url,
            'category'      => $request->category ?? $event->category,
            'organizer'     => $request->organizer ?? $event->organizer,
            'tags'          => $tags ?: $event->tags,
            'price'         => $request->price ?? $event->price,
            'contact_phone' => $request->contact_phone ?? $event->contact_phone,
        ]);

        return response()->json(['success' => true]);
    }

    public function destroy(Request $request, $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return response()->json(['success' => false, 'error' => 'Esemény nem található'], 404);
        }

        if ($event->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'error' => 'Nincs jogosultságod törölni ezt az eseményt'], 403);
        }

        $event->delete();

        return response()->json(['success' => true]);
    }

    public function toggleAttendance(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $user = $request->user();

        $event->attendees()->toggle($user->id);

        return response()->json([
            'success' => true,
            'attending' => $event->attendees()->where('user_id', $user->id)->exists(),
            'attendees_count' => $event->attendees()->count(),
            'message' => 'Részvételi szándék frissítve.'
        ]);
    }

    public function checkAttendance(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $user = $request->user();

        return response()->json([
            'success' => true,
            'attending' => $event->attendees()->where('user_id', $user->id)->exists()
        ]);
    }

    public function recentAttendances()
    {
        $attendances = \Illuminate\Support\Facades\DB::table('attendances')
            ->join('users', 'attendances.user_id', '=', 'users.id')
            ->join('events', 'attendances.event_id', '=', 'events.id')
            ->select('attendances.created_at', 'users.name as user_name', 'events.title as event_title')
            ->orderByDesc('attendances.created_at')
            ->limit(10)
            ->get();
            
        return response()->json(['success' => true, 'attendances' => $attendances]);
    }
}
