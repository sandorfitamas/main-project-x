<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * EnsureIsAdmin middleware – csak admin jogosultság esetén engedélyez át.
 */

class EnsureIsAdmin
{
    /**
     * Ellenőrzi, hogy a felhasználó admin-e. Ha nem, 403-as hibát ad vissza.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (Response)  $next
     * @return Response
     */
    
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || ! $request->user()->is_admin) {
            return response()->json([
                'success' => false,
                'error' => 'Nincs jogosultságod ehhez a művelethez.'
            ], 403);
        }

        return $next($request);
    }
}
