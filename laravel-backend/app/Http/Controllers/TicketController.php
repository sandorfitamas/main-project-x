<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TicketController extends Controller
{
    public function getUserTickets(Request $request)
    {
        $tickets = Ticket::with('event')->where('user_id', $request->user()->id)->orderBy('created_at', 'desc')->get();
        return response()->json(['success' => true, 'tickets' => $tickets]);
    }

    public function buyTicket(Request $request, $eventId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:10'
        ]);

        $event = Event::findOrFail($eventId);

        if ($event->user_id === $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'A saját eseményedre nem vehetsz jegyet!'], 400);
        }

        // Just a basic mock for price calculation if it exists
        $priceVal = 0;
        if (is_numeric($event->price)) {
            $priceVal = (float) $event->price;
        }

        $ticket = Ticket::create([
            'event_id' => $event->id,
            'user_id' => $request->user()->id,
            'quantity' => $request->quantity,
            'total_price' => $priceVal * $request->quantity,
            'status' => 'paid', // Dummy checkout bypass for now
            'ticket_code' => strtoupper(Str::random(10))
        ]);

        return response()->json(['success' => true, 'ticket' => $ticket, 'message' => 'Sikeres jegyvásárlás!']);
    }
}
