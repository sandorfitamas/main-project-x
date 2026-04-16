<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Class TicketController
 * Jegyvásárlás és jegykezelés controller.
 */

class TicketController extends Controller
{
    /**
     * Bejelentkezett felhasználó jegyeinek lekérdezése.
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserTickets(Request $request)
    {
        $userId = $request->user()->id;
        $tickets = Ticket::with('event')
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'tickets' => $tickets
        ]);
    }

    /**
     * Jegyvásárlás egy adott eseményre.
     * @param Request $request
     * @param int $eventId
     * @return \Illuminate\Http\JsonResponse
     */
    public function buyTicket(Request $request, $eventId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:10'
        ]);

        $event = Event::findOrFail($eventId);

        if ($event->user_id === $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'A saját eseményedre nem vehetsz jegyet!'
            ], 400);
        }

        $price = 0;
        if (is_numeric($event->price)) {
            $price = (float) $event->price;
        }

        $ticket = Ticket::create([
            'event_id'    => $event->id,
            'user_id'     => $request->user()->id,
            'quantity'    => $request->quantity,
            'total_price' => $price * $request->quantity,
            'status'      => 'paid',
            'ticket_code' => strtoupper(Str::random(10))
        ]);

        return response()->json([
            'success' => true,
            'ticket'  => $ticket,
            'message' => 'Sikeres jegyvásárlás!'
        ]);
    }
}
