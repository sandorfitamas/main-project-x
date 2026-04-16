<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Ticket model – jegyek adatainak kezelése.
 *
 * @property int $id
 * @property int $event_id
 * @property int $user_id
 * @property int $quantity
 * @property float $total_price
 * @property string $status
 * @property string $ticket_code
 */

class Ticket extends Model
{
    /**
     * A tömegesen kitölthető attribútumok.
     * @var array
     */
    protected $fillable = [
        'event_id',
        'user_id',
        'quantity',
        'total_price',
        'status',
        'ticket_code',
    ];

    /**
     * A jegy tulajdonosa (felhasználó).
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * A jegyhez tartozó esemény.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
