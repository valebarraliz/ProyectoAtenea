<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use Inertia\Inertia;
use App\Events\VoteCast;
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

        $partyIds = $votes->pluck('party.id')->toArray();
        $partyNames = $votes->pluck('party.name')->toArray();
        $voteCounts = $votes->pluck('vote_count')->toArray();
        return Inertia::render('Welcome', [
            'voteList' => [
                'party_ids' => $partyIds,
                'party_names' => $partyNames,
                'vote_counts' => $voteCounts
            ],
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }
    public function store(Request $request){
        $request->validate([
            'party_id'=>['required','integer','exists:parties,id']
        ]);
        if(count($request->user()->vote)){
            if(!$request->user()->vote->last()->discarded){
               return redirect()->back()->with('error', 'You have voted');
            }
        }
        $vote = Vote::create([
            'user_id' => $request->user()->id,
            'party_id' => $request->party_id,
        ]);
        $partyName = $vote->party->name;
        $voteCount = Vote::where('party_id', $request->party_id)->count();
        event(new VoteCast($request->party_id, $partyName, $voteCount));
        return redirect()->intended(route('dashboard'));;
    }
}
