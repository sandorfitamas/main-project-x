<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Review model – esemény értékelések kezelése.
 *
 * @property int $id
 * @property int $event_id
 * @property int $user_id
 * @property float $rating
 * @property string|null $comment
 */

class Review extends Model
{
    /**
     * A tömegesen kitölthető attribútumok.
     * @var array
     */
    protected $fillable = [
        'event_id',
        'user_id',
        'rating',
        'comment',
    ];

    /**
     * Az értékelést író felhasználó.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Az értékelt esemény.
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
