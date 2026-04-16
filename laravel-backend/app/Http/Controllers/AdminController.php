<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Event;
use App\Models\Review;
use Illuminate\Http\Request;

/**
 * Class AdminController
 * Adminisztrációs műveletekért felelős controller.
 */

class AdminController extends Controller
{
    /**
     * Admin dashboard statisztikák.
     * @return \Illuminate\Http\JsonResponse
     */
    public function dashboard()
    {
        return response()->json([
            'success' => true,
            'stats' => [
                'users_count' => User::count(),
                'events_count' => Event::count(),
                'reviews_count' => Review::count(),
            ]
        ]);
    }

    /**
     * Felhasználók listázása admin felületen.
     * @return \Illuminate\Http\JsonResponse
     */
    public function users()
    {
        $users = User::orderBy('id', 'asc')->get();
        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    }

    /**
     * Felhasználó törlése.
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        if ($user->is_admin) {
            return response()->json([
                'success' => false,
                'error' => 'Védett adminisztrátor nem törölhető!'
            ], 403);
        }
        $user->delete();
        return response()->json(['success' => true]);
    }

    /**
     * Felhasználó felfüggesztése vagy visszaállítása.
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function suspendUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        if ($user->is_admin) {
            return response()->json([
                'success' => false,
                'error' => 'Adminisztrátor nem függeszthető fel!'
            ], 403);
        }

        $days = $request->input('days');
        if ($days === 0 || $days === '0' || $days === null) {
            $user->suspended_until = null; // Feloldás
        } else {
            $user->suspended_until = now()->addDays((int)$days);
        }

        $user->save();
        return response()->json(['success' => true]);
    }

    /**
     * Események listázása admin felületen.
     * @return \Illuminate\Http\JsonResponse
     */
    public function events()
    {
        $events = Event::with('user')->orderBy('id', 'asc')->get();
        return response()->json([
            'success' => true,
            'events' => $events->map(fn ($event) => array_merge($event->toApiArray(), [
                'creator_name' => $event->user->name ?? $event->organizer ?? 'Ismeretlen'
            ]))
        ]);
    }

    /**
     * Esemény törlése.
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteEvent($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();
        return response()->json(['success' => true]);
    }

    /**
     * Esemény felfüggesztése vagy visszaállítása.
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function suspendEvent(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $days = $request->input('days');
        if ($days === 0 || $days === '0' || $days === null) {
            $event->suspended_until = null; // Feloldás
        } else {
            $event->suspended_until = now()->addDays((int)$days);
        }
        
        $event->save();
        return response()->json(['success' => true]);
    }

    public function reviews()
    {
        $reviews = Review::with(['user', 'event'])->orderBy('id', 'asc')->get();
        return response()->json([
            'success' => true,
            'reviews' => $reviews->map(function($r) {
                return [
                    'id' => $r->id,
                    'user_id' => $r->user_id,
                    'user_name' => $r->user->name ?? 'Ismeretlen',
                    'event_id' => $r->event_id,
                    'event_title' => $r->event->title ?? 'Törölt/Ismeretlen',
                    'rating' => $r->rating,
                    'comment' => $r->comment,
                    'created_at' => $r->created_at,
                    'user_suspended_until' => $r->user->suspended_until ?? null,
                    'user_is_admin' => $r->user->is_admin ?? false
                ];
            })
        ]);
    }

    public function deleteReview($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();
        return response()->json(['success' => true]);
    }
}
