<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        Role::create([
            'name' => 'admin',
        ]);
        Role::create([
            'name' => 'user',
        ]);
        User::create([
            'citizen_number' => '11112222',
            'name' => 'Administrador',
            'role_id' => 1,
            'password' => Hash::make('@dmin3duvot3'),
            'email' => 'admin@eduvote.com',
        ]);
        User::create([
            'citizen_number' => '22223333',
            'name' => 'User',
            'role_id' => 2,
            'password' => Hash::make('@dmin3duvot3'),
            'email' => 'user@eduvote.com',
        ]);
    }
}
