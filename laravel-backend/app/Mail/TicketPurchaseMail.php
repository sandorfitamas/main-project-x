<?php

namespace App\Mail;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
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
     * Számlához csoportosított tételek.
     * @var array<int, array<string, mixed>>
     */
    public $invoiceItems = [];

    /**
     * Számla végösszeg.
     * @var float
     */
    public $invoiceTotal = 0.0;

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
        $this->prepareInvoiceItems();
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
        $invoiceFileName = 'szamla-' . now()->format('Ymd-His') . '.pdf';
        $pdfBinary = Pdf::loadView('pdf.invoice', [
            'invoiceNumber' => 'PX-' . now()->format('YmdHis'),
            'issuedAt' => now(),
            'invoiceItems' => $this->invoiceItems,
            'invoiceTotal' => $this->invoiceTotal,
            'buyerName' => $this->customer['name'] ?? ($this->user->name ?? '-'),
            'buyerEmail' => $this->customer['email'] ?? ($this->user->email ?? '-'),
            'buyerPhone' => $this->customer['phone'] ?? '-',
            'buyerAddress' => $this->buildBuyerAddress(),
        ])->output();

        $tempPdfPath = storage_path('app/invoices/' . uniqid('invoice_', true) . '.pdf');

        if (!is_dir(dirname($tempPdfPath))) {
            mkdir(dirname($tempPdfPath), 0755, true);
        }

        file_put_contents($tempPdfPath, $pdfBinary);

        return [
            Attachment::fromPath($tempPdfPath)
                ->as($invoiceFileName)
                ->withMime('application/pdf'),
        ];
    }

    /**
     * Számla tételek előkészítése eseményenként csoportosítva.
     * @return void
     */
    private function prepareInvoiceItems(): void
    {
        $groupedByEvent = [];

        foreach ($this->tickets as $ticket) {
            $eventId = $ticket->event_id ?? ($ticket->event->id ?? null);
            if (!$eventId) {
                continue;
            }

            if (!isset($groupedByEvent[$eventId])) {
                $groupedByEvent[$eventId] = [
                    'event_title' => $ticket->event->title ?? 'Ismeretlen esemény',
                    'quantity' => 0,
                    'unit_price' => (float) ($ticket->total_price ?? 0),
                    'line_total' => 0.0,
                ];
            }

            $quantity = (int) ($ticket->quantity ?? 1);
            $lineAmount = (float) ($ticket->total_price ?? 0);

            $groupedByEvent[$eventId]['quantity'] += $quantity;
            $groupedByEvent[$eventId]['line_total'] += $lineAmount;
        }

        $this->invoiceItems = array_values($groupedByEvent);
        $this->invoiceTotal = array_reduce(
            $this->invoiceItems,
            fn (float $carry, array $item) => $carry + (float) $item['line_total'],
            0.0
        );
    }

    /**
     * Számlázási cím összeállítása checkout adatokból.
     * @return string
     */
    private function buildBuyerAddress(): string
    {
        $zip = trim((string) ($this->customer['zip'] ?? ''));
        $city = trim((string) ($this->customer['city'] ?? ''));
        $address = trim((string) ($this->customer['address'] ?? ''));
        $other = trim((string) ($this->customer['other'] ?? ''));

        $mainPart = trim($zip . ' ' . $city);
        $fullAddress = trim($mainPart . ', ' . $address, ' ,');

        if ($other !== '') {
            $fullAddress .= ' (' . $other . ')';
        }

        return $fullAddress !== '' ? $fullAddress : '-';
    }
}
