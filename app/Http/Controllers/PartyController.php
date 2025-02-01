<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Party;
use Illuminate\Support\Facades\Log;

class PartyController extends Controller
{
    /**
     * Muestra la vista principal de partidos.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Aquí iría la lógica para cargar los partidos si es necesario
    }

    /**
     * Crea un nuevo partido.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'image' => ['required', 'image'],
        ]);

        try {
            $party = Party::create($request->all());

            if ($request->hasFile('image')) {
                $name = $party->id . '.' . $request->file('image')->getClientOriginalName();
                $image = $request->file('image')->storeAs('img', $name, 'public');
                $party->image = '/img/' . $name;
                $party->save();
            }

            return redirect()->route('dashboard')
                ->with('success', 'El partido ' . $party->name . ' ha sido creado correctamente.')
                ->with('success_timestamp', now()->timestamp);

        } catch (\Exception $e) {
            Log::error('Error al crear el partido: ' . $e->getMessage());

            return redirect()->back()->with('error', 'Ocurrió un error al crear el partido.')
                ->with('error_timestamp', now()->timestamp);
        }
    }

    /**
     * Actualiza la información de un partido existente.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer'],
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'image'],
        ]);

        try {
            $party = Party::findOrFail($request->id);
            $party->update(['name' => $request->name, 'description' => $request->description]);

            if ($request->hasFile('image')) {
                unlink(public_path() . '/storage' . $party->image);
                $name = $party->id . '.' . $request->file('image')->getClientOriginalName();
                $image = $request->file('image')->storeAs('img', $name, 'public');
                $party->image = '/img/' . $name;
                $party->save();
            }

            return redirect()->route('dashboard')
                ->with('success', 'El partido ' . $party->name . ' ha sido actualizado correctamente.')
                ->with('success_timestamp', now()->timestamp);

        } catch (\Exception $e) {
            Log::error('Error al actualizar el partido: ' . $e->getMessage());

            return redirect()->back()->with('error', 'Ocurrió un error al actualizar el partido.')
                ->with('error_timestamp', now()->timestamp);
        }
    }

    /**
     * Descartar un partido por su ID.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function discardPartyById(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer'],
        ]);

        try {
            $party = Party::findOrFail($request->id);
            $party->update(['discarded' => true]);

            return redirect()->route('dashboard')
                ->with('success', 'Se ha descartado el partido ' . $party->name)
                ->with('success_timestamp', now()->timestamp);

        } catch (\Exception $e) {
            Log::error('Error al descartar el partido: ' . $e->getMessage());

            return redirect()->back()->with('error', 'Ocurrió un error al descartar el partido.')
                ->with('error_timestamp', now()->timestamp);
        }
    }

    /**
     * Recupera un partido descartado por su ID.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function recoverPartyById(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer'],
        ]);

        try {
            $party = Party::findOrFail($request->id);
            $party->update(['discarded' => false]);

            return redirect()->route('dashboard')
                ->with('success', 'Se ha recuperado el partido ' . $party->name)
                ->with('success_timestamp', now()->timestamp);

        } catch (\Exception $e) {
            Log::error('Error al recuperar el partido: ' . $e->getMessage());

            return redirect()->back()->with('error', 'Ocurrió un error al recuperar el partido.')
                ->with('error_timestamp', now()->timestamp);
        }
    }

    /**
     * Descartar todos los partidos no descartados.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function discardParties()
    {
        try {
            Party::query()->where('discarded', '!=', true)
                ->update(['discarded' => true]);

            return redirect()->route('database')
                ->with('success', 'Se han descartado todos los partidos.')
                ->with('success_timestamp', now()->timestamp);

        } catch (\Exception $e) {
            Log::error('Error al descartar todos los partidos: ' . $e->getMessage());

            return redirect()->back()->with('error', 'Ocurrió un error al descartar los partidos.')
                ->with('error_timestamp', now()->timestamp);
        }
    }

    /**
     * Elimina un partido por su ID.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function deletePartyById(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer'],
        ]);

        try {
            $party = Party::findOrFail($request->id);
            $party->delete();

            return redirect()->route('dashboard')
                ->with('success', 'Se ha eliminado el partido ' . $party->name)
                ->with('success_timestamp', now()->timestamp);

        } catch (\Exception $e) {
            Log::error('Error al eliminar el partido: ' . $e->getMessage());

            return redirect()->back()->with('error', 'Ocurrió un error al eliminar el partido.')
                ->with('error_timestamp', now()->timestamp);
        }
    }

    /**
     * Obtiene los partidos ganadores.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getWinningParties()
    {
        return Party::where('iswinner', '!=', false)->get();
    }

    /**
     * Selecciona el partido ganador basado en los votos.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function selectWinningParty(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer'],
        ]);

        $parties = Party::where('discarded', false)->get();
        $maxVotes = $parties->max('votes');
        $winningParties = $parties->filter(function ($party) use ($maxVotes) {
            return $party->votes === $maxVotes;
        });

        if ($winningParties->count() > 1) {
            return redirect()->back()->with('error', 'Hay varios partidos con la misma cantidad de votos.')
                ->with('error_timestamp', now()->timestamp);
        }

        $winningParty = $winningParties->first();
        $winningParty->update(['iswinner' => true]);

        return redirect()->back()->with('success', 'Se ha elegido el partido ganador')
            ->with('success_timestamp', now()->timestamp);
    }
}
