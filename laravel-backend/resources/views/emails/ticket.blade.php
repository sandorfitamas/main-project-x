<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Sikeres Jegyvásárlás - Project X</title>
    <style>
        body { background-color: #0f172a !important; color: #f8fafc; font-family: sans-serif; margin: 0; padding: 0; width: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table.body-wrap { width: 100%; background-color: #0f172a; margin: 0; padding: 0; border-collapse: collapse; table-layout: fixed; }
        .wrapper { max-width: 480px; margin: 0 auto; background-color: #1e293b; padding: 30px; border-radius: 12px; border: 1px solid #334155; text-align: left; }
        .title { color: #d946ef; margin-top: 0; text-align: center; margin-bottom: 15px; font-size: 20px; }
        .text { font-size: 13px; margin-bottom: 15px; color: #cbd5e1; }
        .ticket-list { margin-top: 15px; }
        .ticket-info { padding: 15px; width: 60%; }
        .ticket-title { margin: 0 0 5px 0; color: #f8fafc; font-size: 15px; }
        .ticket-details { margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.4; }
        .ticket-qr { padding: 15px; width: 40%; text-align: center; border-left: 2px dashed #475569; background-color: #1e293b; }
        .qr-img { display: inline-block; margin: 0 auto; background: white; padding: 4px; border-radius: 4px; border: none; }
        .qr-code-text { color: #f8fafc; font-weight: bold; margin-top: 8px; letter-spacing: 1px; font-size: 11px; }
        .footer { margin-top: 15px; border-top: 1px solid #334155; padding-top: 12px; color: #64748b; font-size: 11px; text-align: center; }
    </style>
</head>
<body style="background-color: #0f172a; margin: 0; padding: 0;">
    <table class="body-wrap" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0f172a">
        <tr>
            <td align="center" valign="top" style="padding: 40px 15px; background-color: #0f172a;">
                
                <div class="wrapper">
                    <h2 class="title">Sikeres Jegyvásárlás!</h2>
                    <div class="text">
                        Kedves <strong>{{ $customer['name'] ?? $user->name }}</strong>,<br><br>
                        Köszönjük a vásárlásodat a Project X rendszerén keresztül! Az alábbiakban találod a megvásárolt jegyeid részleteit és a beléptetéshez szükséges QR kódokat.
                    </div>
                    
                    <div class="ticket-list">
                        @foreach($tickets as $ticket)
                        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0f172a; border-radius: 8px; margin-bottom: 20px; border: 1px solid #334155; border-collapse: separate; overflow: hidden; table-layout: fixed;">
                            <tr>
                                <td class="ticket-info" width="60%" valign="middle">
                                    <h4 class="ticket-title">{{ $ticket->event->title ?? 'Esemény' }}</h4>
                                    <p class="ticket-details">
                                        Dátum: {{ $ticket->event->date ? \Carbon\Carbon::parse($ticket->event->date)->format('Y. F d.') : '-' }}<br>
                                        Mennyiség: {{ $ticket->quantity }} db<br>
                                        Ár: {{ number_format($ticket->total_price, 0, '', ' ') }} Ft
                                    </p>
                                </td>
                                <td class="ticket-qr" width="40%" align="center" valign="middle">
                                    <img class="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data={{ urlencode($ticket->ticket_code) }}&margin=0" alt="QR" width="80" height="80" />
                                    <div class="qr-code-text">{{ $ticket->ticket_code }}</div>
                                </td>
                            </tr>
                        </table>
                        @endforeach
                    </div>
                    
                    <div class="footer">
                        Ezt az üzenetet egy automatikus rendszer küldte. Kérjük, ne válaszolj rá.<br>
                        &copy; 2026 Project X. Minden jog fenntartva.<br>
                        <span style="color: transparent; font-size: 0px; display: none;">Megrendelés azonosító: {{ \Carbon\Carbon::now()->timestamp }}-{{ \Illuminate\Support\Str::random(10) }}</span>
                    </div>
                </div>

            </td>
        </tr>
    </table>
</body>
</html>
