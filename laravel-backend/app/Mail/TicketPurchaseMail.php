<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * TicketPurchaseMail – Jegyvásárlás visszaigazoló email.
 *
 * @property array $tickets
 * @property array $customer
 * @property \App\Models\User|null $user
 */

class TicketPurchaseMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * A vásárolt jegyek tömbje.
     * @var array
     */
    public $tickets;

    /**
     * Vásárló adatai.
     * @var array
     */
    public $customer;

    /**
     * Felhasználó modell (opcionális).
     * @var \App\Models\User|null
     */
    public $user;

    /**
     * Létrehozza az email példányt.
     * @param array $tickets
     * @param array $customer
     * @param \App\Models\User|null $user
     */
    public function __construct(array $tickets, array $customer = [], \App\Models\User $user = null)
    {
        $this->tickets = $tickets;
        $this->customer = $customer;
        $this->user = $user;
    }

    /**
     * Email envelope (tárgy, feladó, stb.).
     * @return Envelope
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Sikeres Jegyvásárlás - Project X',
        );
    }

    /**
     * Email tartalom (nézet, változók).
     * @return Content
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.ticket',
            with: [
                'tickets' => $this->tickets,
                'customer' => $this->customer,
                'user' => $this->user,
            ],
        );
    }

    /**
     * Email csatolmányok.
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
