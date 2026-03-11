<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
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
    ];

    protected $casts = [
        'rating' => 'float',
        'date'   => 'date:Y-m-d',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function toApiArray(): array
    {
        return [
            'id'            => $this->id,
            'title'         => $this->title,
            'description'   => $this->description ?? '',
            'rating'        => (float) $this->rating,
            'date'          => $this->date ? $this->date->format('Y-m-d') : '',
            'time'          => $this->time ?? '',
            'location'      => $this->location,
            'imageUrl'      => $this->image_url ?? '',
            'category'      => $this->category ?? 'Egyéb',
            'organizer'     => $this->organizer ?? '',
            'user_id'       => $this->user_id,
            'tags'          => $this->tags ? explode(',', $this->tags) : [],
            'price'         => $this->price ?? '',
            'contact_phone' => $this->contact_phone ?? '',
            'created_at'    => $this->created_at ? $this->created_at->toISOString() : null,
        ];
    }
}
