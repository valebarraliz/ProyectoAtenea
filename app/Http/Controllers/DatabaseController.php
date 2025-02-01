<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Party;
use App\Models\Vote;

class DatabaseController extends Controller
{
    public function index(){
        return Inertia::render('Admin/ManageDatabase');
    }

    public function delete(){
        User::where('role_id','!=',1)->delete();
        Vote::query()->delete();
        Party::query()->delete();
    }
}
