<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Party;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()) {

            switch ($request->user()->role_id) {
                case 1:
                    $parties = Party::all();
                    return Inertia::render('Admin/Dashboard', [
                        'parties' => $parties
                    ]);
                case 2:
                    $parties = Party::where('discarded', '!=', true)->get();
                    return Inertia::render('User/Dashboard', [
                        'parties' => $parties,
                    ]);
                default:
                    return redirect()->back()->with('error', 'Unauthorized');
            }
        }
    }
}
