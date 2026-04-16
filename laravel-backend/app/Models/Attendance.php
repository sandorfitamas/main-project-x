<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Attendance model – esemény részvétel kezelése (pivot tábla).
 *
 * @property int $id
 * @property int $user_id
 * @property int $event_id
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */

class Attendance extends Model
{
    /**
     * A tömegesen kitölthető attribútumok.
     * @var array
     */
    protected $fillable = [
        'user_id',
        'event_id',
    ];

    /**
     * A részvételhez tartozó felhasználó.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * A részvételhez tartozó esemény.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
