<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $user_id
 * @property int $event_id
 * @property \App\Models\User $user
 * @property \App\Models\Event $event
 */

class Favorite extends Model
{
    protected $fillable = ['user_id', 'event_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
