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
        $validated = $request->validate([
            'email' => ['required', 'email', 'confirmed'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'force_password_reset' => false
        ]);

        return redirect()->intended(route('dashboard'));
    }
}
