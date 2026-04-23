<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Event model – események adatainak kezelése.
 *
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property float $rating
 * @property string $date
 * @property string $time
 * @property string $location
 * @property string|null $image_url
 * @property string|null $category
 * @property string|null $organizer
 * @property int $user_id
 * @property string|null $tags
 * @property string|null $price
 * @property string|null $contact_phone
 * @property \Carbon\Carbon|null $suspended_until
 */

class Event extends Model
{
    /**
     * Az eseményhez tartozó értékelések (review-k).
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function reviews()
    {
        return $this->hasMany(\App\Models\Review::class);
    }
    /**
     * A tömegesen kitölthető attribútumok.
     * @var array
     */
    protected $fillable = [
        'title',
        'description',
        'rating',
        'date',
        'time',
        'location',
        'image_url',
        'category',
        'organizer',
        'user_id',
        'tags',
        'price',
        'contact_phone',
        'suspended_until',
    ];

    /**
     * Attribútumok típuskonverziói.
     * @var array
     */
    protected $casts = [
        'rating' => 'float',
        'date'   => 'date:Y-m-d',
        'suspended_until' => 'datetime',
    ];

    /**
     * Az esemény szervezője (felhasználó).
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Az eseményhez tartozó kedvencek.
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Az esemény résztvevői (pivot tábla: attendances).
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function attendees()
    {
        return $this->belongsToMany(User::class, 'attendances')->withTimestamps();
    }

    /**
     * API válaszhoz formázott tömb.
     * @return array
     */
    public function toApiArray(): array
    {
        return [
            'id'              => $this->id,
            'title'           => $this->title,
            'description'     => $this->description ?? '',
            'rating'          => (float) $this->rating,
            'date'            => $this->date ? $this->date->format('Y-m-d') : '',
            'time'            => $this->time ?? '',
            'location'        => $this->location,
            'imageUrl'        => $this->image_url ? (str_starts_with($this->image_url, '/') ? url($this->image_url) : $this->image_url) : '',
            'category'        => $this->category ?? 'Egyéb',
            'organizer'       => $this->organizer ?? '',
            'user_id'         => $this->user_id,
            'tags'            => $this->tags ? explode(',', $this->tags) : [],
            'price'           => $this->price ?? '',
            'contact_phone'   => $this->contact_phone ?? '',
            'created_at'      => $this->created_at ? $this->created_at->toISOString() : null,
            'attendees_count' => $this->attendees_count ?? 0,
            'suspended_until' => $this->suspended_until ? $this->suspended_until->toISOString() : null,
        ];
    }
}
