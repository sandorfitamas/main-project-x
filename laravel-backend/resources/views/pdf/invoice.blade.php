<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <title>Számla - {{ $invoiceNumber }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #111827;
            font-size: 12px;
            line-height: 1.4;
            margin: 24px;
        }
        h1 {
            margin: 0 0 6px;
            font-size: 24px;
        }
        h2 {
            margin: 18px 0 10px;
            font-size: 15px;
        }
        .muted {
            color: #6b7280;
        }
        .block {
            margin-bottom: 14px;
        }
        .meta-table,
        .items-table {
            width: 100%;
            border-collapse: collapse;
        }
        .meta-table td {
            padding: 4px 0;
            vertical-align: top;
        }
        .items-table th,
        .items-table td {
            border: 1px solid #d1d5db;
            padding: 8px;
        }
        .items-table th {
            background: #f3f4f6;
            text-align: left;
        }
        .text-right {
            text-align: right;
        }
        .total-row td {
            font-weight: bold;
            background: #f9fafb;
        }
    </style>
</head>
<body>
    <h1>Számla</h1>
    <div class="block muted">Project X - Jegyvásárlás</div>

    <table class="meta-table block">
        <tr>
            <td><strong>Számlaszám:</strong> {{ $invoiceNumber }}</td>
            <td class="text-right"><strong>Kiállítás dátuma:</strong> {{ $issuedAt->format('Y-m-d H:i') }}</td>
        </tr>
    </table>

    <h2>Vevő adatai</h2>
    <table class="meta-table block">
        <tr>
            <td><strong>Vevő:</strong> {{ $buyerName }}</td>
        </tr>
        <tr>
            <td><strong>Email:</strong> {{ $buyerEmail }}</td>
        </tr>
        <tr>
            <td><strong>Telefonszám:</strong> {{ $buyerPhone }}</td>
        </tr>
        <tr>
            <td><strong>Lakcím:</strong> {{ $buyerAddress }}</td>
        </tr>
    </table>

    <h2>Tételek</h2>
    <table class="items-table">
        <thead>
            <tr>
                <th>Esemény</th>
                <th class="text-right">Jegyek száma</th>
                <th class="text-right">Egységár (Ft)</th>
                <th class="text-right">Összesen (Ft)</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoiceItems as $item)
                <tr>
                    <td>{{ $item['event_title'] }}</td>
                    <td class="text-right">{{ $item['quantity'] }}</td>
                    <td class="text-right">{{ number_format((float) $item['unit_price'], 0, ',', ' ') }}</td>
                    <td class="text-right">{{ number_format((float) $item['line_total'], 0, ',', ' ') }}</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="3" class="text-right">Végösszeg (Ft)</td>
                <td class="text-right">{{ number_format((float) $invoiceTotal, 0, ',', ' ') }}</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
