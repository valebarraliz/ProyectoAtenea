<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules\Password;

class UpdateInformationController extends Controller
{
    public function index()
    {
        return Inertia::render('Auth/UpdateInfo');
    }
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate(
            [
                'email' => ['required', 'email', 'confirmed'],
                'password' => [
                    'required',
                    'string',
                    'min:8',
                    'max:16',
                    'regex:/[a-z]/',
                    'regex:/[A-Z]/',
                    'regex:/[0-9]/',
                    'regex:/[@$!%*?&]/',
                    'confirmed'
                ]
            ],
            ['password.regex' => 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.']
        );

        $request->user()->update([
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'force_password_reset' => false
        ]);

        return redirect()->intended(route('dashboard'));
    }
}
