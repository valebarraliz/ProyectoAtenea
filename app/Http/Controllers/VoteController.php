<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Events\VoteCast;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class VoteController extends Controller
{
    public function index()
    {
        $votes = Vote::with('party')
            ->where('discarded', '!=', true)
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
                'vote_counts' => $voteCounts,
            ],
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'party_id' => ['required', 'integer', 'exists:parties,id'],
        ]);

        if ($request->user()->vote()->where('discarded', false)->exists()) {
            return redirect()->back()->with('error', 'Ya ha votado')->with('error_timestamp', now()->timestamp);
        }

        DB::beginTransaction();
        try {
            $vote = Vote::create([
                'user_id' => $request->user()->id,
                'party_id' => $request->party_id,
            ]);

            $partyName = $vote->party->name;
            $voteCount = $vote->party->votes()->count();

            event(new VoteCast($request->party_id, $partyName, $voteCount));

            DB::commit();
            return redirect()->back()->with('success', 'Tu voto ha sido registrado con éxito.')->with('success_timestamp', now()->timestamp);
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e);
            return redirect()->back()->with('error', 'Error al registrar su voto')->with('error_timestamp', now()->timestamp);
        }
    }

    public function discardVotes()
    {
        Vote::query()->where('discarded', '!=', true)
            ->update(['discarded' => true]);

        return to_route('database')->with('success', 'Se han descartado los votos.')->with('success_timestamp', now()->timestamp);
    }
}
