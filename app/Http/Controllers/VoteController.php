<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

class VoteController extends Controller
{
    public function index()
    {
        $votes = Vote::with('party')
            ->selectRaw('party_id, COUNT(*) as vote_count')
            ->groupBy('party_id')
            ->get();

        $partyNames = $votes->pluck('party.name')->toArray();
        $voteCounts = $votes->pluck('vote_count')->toArray();
        return Inertia::render('Welcome', [
            'voteList' => [
                'party_names' => $partyNames,
                'vote_counts' => $voteCounts
            ],
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }
}
