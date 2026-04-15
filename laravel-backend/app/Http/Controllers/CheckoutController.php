<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\TicketPurchaseMail;

class CheckoutController extends Controller
{
    public function process(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.event_id' => 'required|exists:events,id',
            'items.*.quantity' => 'required|integer|min:1|max:10'
        ]);

        $user = $request->user();
        $tickets = [];

        DB::beginTransaction();

        try {
            foreach ($request->items as $item) {
                $event = Event::findOrFail($item['event_id']);
                
                if ($event->user_id === $user->id) {
                    throw new \Exception("A saját eseményedre nem vehetsz jegyet: " . $event->title);
                }

                $priceVal = 0;
                $priceStr = strtolower(str_replace(' ', '', $event->price));
                if (preg_match('/(\d+)/', $priceStr, $matches)) {
                    $priceVal = (float) $matches[1];
                }

                // Generáljunk minden egyes jegyhez egyedi példányt, hogy külön QR kódjuk lehessen
                for ($i = 0; $i < $item['quantity']; $i++) {
                    $ticket = Ticket::create([
                        'event_id' => $event->id,
                        'user_id' => $user->id,
                        'quantity' => 1,
                        'total_price' => $priceVal,
                        'status' => 'paid',
                        'ticket_code' => strtoupper(Str::random(10))
                    ]);

                    $tickets[] = $ticket->load('event');
                }
            }

            DB::commit();

            try {
                $customerData = $request->input('customer', []);
                $emailTo = $customerData['email'] ?? $user->email;
                if ($emailTo) {
                    Mail::to($emailTo)->send(new \App\Mail\TicketPurchaseMail($tickets, $customerData, $user));
                }
            } catch (\Exception $mailEx) {
                \Illuminate\Support\Facades\Log::error('Mail sending failed: ' . $mailEx->getMessage());
            }
            return response()->json(['success' => true, 'tickets' => $tickets, 'message' => 'Sikeres rendelés!']);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => $e->getMessage()], 400);
        }
    }
}
