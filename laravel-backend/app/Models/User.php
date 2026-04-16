<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * User model – a felhasználók adatainak kezelése.
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string|null $profile_picture
 * @property bool $is_admin
 * @property \Carbon\Carbon|null $suspended_until
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 */

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * A tömegesen kitölthető attribútumok.
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'profile_picture',
        'is_admin',
        'suspended_until',
    ];

    /**
     * Az elrejtendő attribútumok tömbje (pl. API válaszban).
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Az attribútumok típuskonverziói.
     * @return array
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'suspended_until' => 'datetime',
        ];
    }

    /**
     * Egy felhasználó által létrehozott események.
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function events()
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Egy felhasználó kedvenc eseményei.
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Egy felhasználó részvételei eseményeken (pivot tábla: attendances).
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function attendances()
    {
        return $this->belongsToMany(Event::class, 'attendances')->withTimestamps();
    }
}
