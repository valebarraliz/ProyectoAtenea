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
    /**
     * Muestra la vista principal con los votos.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $votes = Vote::with('party')
            ->where('discarded', '!=', true)
            ->selectRaw('party_id, COUNT(*) as vote_count')
            ->groupBy('party_id')
            ->get();
        $winningParty = app(PartyController::class)->getWinningParty();
        $partyIds = $votes->pluck('party.id')->toArray();
        $partyNames = $votes->pluck('party.name')->toArray();
        $voteCounts = $votes->pluck('vote_count')->toArray();
        return Inertia::render('Welcome', [
            'winningParty' => $winningParty,
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

    /**
     * Registra un nuevo voto.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'party_id' => ['required', 'integer', 'exists:parties,id'],
        ]);

        // Verificar si el usuario ya ha votado
        if ($request->user()->vote()->where('discarded', false)->exists()) {
            return $this->redirectWithMessage('error', 'Ya ha votado.');
        }

        DB::beginTransaction();
        try {
            // Crear el voto
            $vote = Vote::create([
                'user_id' => $request->user()->id,
                'party_id' => $request->party_id,
            ]);

            // Obtener información del partido
            $partyName = $vote->party->name;
            $voteCount = $vote->party->votes()->where('discarded', false)->count();

            // Disparar el evento VoteCast
            event(new VoteCast($request->party_id, $partyName, $voteCount));

            DB::commit();
            return $this->redirectWithMessage('success', 'Tu voto ha sido registrado con éxito.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->redirectWithMessage('error', 'Error al registrar su voto: ' . $e->getMessage());
        }
    }

    /**
     * Descarta todos los votos no descartados.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function discardVotes()
    {
        try {
            Vote::query()->where('discarded', '!=', true)
                ->update(['discarded' => true]);

            return $this->redirectWithMessage('success', 'Se han descartado los votos.');
        } catch (\Exception $e) {
            return $this->redirectWithMessage('error', 'Ocurrió un error al descartar los votos.');
        }
    }

    /**
     * Método genérico para redireccionar con mensajes de éxito o error.
     *
     * @param string $type Tipo de mensaje (success o error).
     * @param string $message Contenido del mensaje.
     * @return \Illuminate\Http\RedirectResponse
     */
    private function redirectWithMessage($type, $message)
    {
        return redirect()->back()
            ->with($type, $message)
            ->with($type . '_timestamp', now()->timestamp);
    }
}
