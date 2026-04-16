<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

/**
 * Class UserController
 * Felhasználók kezeléséért felelős controller.
 */

class UserController extends Controller
{
    /**
     * Felhasználók listázása.
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    }
}
