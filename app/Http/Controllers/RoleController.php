<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()) {
            switch ($request->user()->role_id) {
                case 1:
                    return Inertia::render('Admin/Dashboard');
                case 2:
                    return Inertia::render('User/Dashboard');
                default:
                    return redirect()->back()->with('error', 'Unauthorized');
            }
        }
    }
}
