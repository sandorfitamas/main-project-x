<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\User::updateOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin',
                'password' => \Illuminate\Support\Facades\Hash::make('Admin123!'),
                'is_admin' => true,
            ]
        );

        \App\Models\User::updateOrCreate(
            ['email' => 'teszt@gmail.com'],
            [
                'name' => 'Teszt User',
                'password' => \Illuminate\Support\Facades\Hash::make('Teszt123'),
                'is_admin' => false,
            ]
        );
    }
}
