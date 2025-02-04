<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Party;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Events\PartyCast;

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

            return $this->redirectWithMessage('success', 'El partido ' . $party->name . ' ha sido creado correctamente.');
        } catch (\Exception $e) {
            Log::error('Error al crear el partido: ' . $e->getMessage());
            return $this->redirectWithMessage('error', 'Ocurrió un error al crear el partido.');
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

            return $this->redirectWithMessage('success', 'El partido ' . $party->name . ' ha sido actualizado correctamente.');
        } catch (\Exception $e) {
            Log::error('Error al actualizar el partido: ' . $e->getMessage());
            return $this->redirectWithMessage('error', 'Ocurrió un error al actualizar el partido.');
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
            $party->update(['discarded' => true, 'iswinner' => false]);

            return $this->redirectWithMessage('success', 'Se ha descartado el partido ' . $party->name);
        } catch (\Exception $e) {
            Log::error('Error al descartar el partido: ' . $e->getMessage());
            return $this->redirectWithMessage('error', 'Ocurrió un error al descartar el partido.');
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

            return $this->redirectWithMessage('success', 'Se ha recuperado el partido ' . $party->name);
        } catch (\Exception $e) {
            Log::error('Error al recuperar el partido: ' . $e->getMessage());
            return $this->redirectWithMessage('error', 'Ocurrió un error al recuperar el partido.');
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
                ->update(['discarded' => true, 'iswinner' => false]);

            return $this->redirectWithMessage('success', 'Se han descartado todos los partidos.');
        } catch (\Exception $e) {
            Log::error('Error al descartar todos los partidos: ' . $e->getMessage());
            return $this->redirectWithMessage('error', 'Ocurrió un error al descartar los partidos.');
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

            return $this->redirectWithMessage('success', 'Se ha eliminado el partido ' . $party->name);
        } catch (\Exception $e) {
            Log::error('Error al eliminar el partido: ' . $e->getMessage());
            return $this->redirectWithMessage('error', 'Ocurrió un error al eliminar el partido.');
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
     * Obtiene el partido ganador.
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function getWinningParty()
    {
        $party = Party::where('iswinner', '!=', false)->where('discarded', '!=', true)->first();
        if ($party) {
            // Agregar la cantidad de votos al objeto del partido
            $party->votes_count = $party->votes()->where('discarded', false)->count();
            if ($party->votes_count) {
                return $party;
            }
        }

        return null;
    }

    /**
     * Selecciona el partido ganador basado en los votos.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function selectWinningParty()
    {
        // Usar una transacción para garantizar la atomicidad
        DB::beginTransaction();

        try {
            // Obtener todos los partidos no descartados
            $parties = Party::where('discarded', false)->get();

            // Encontrar el número máximo de votos
            $maxVotes = $parties->max('votes');

            // Filtrar los partidos con el máximo de votos
            $winningParties = $parties->filter(function ($party) use ($maxVotes) {
                return $party->votes === $maxVotes;
            });

            // Si hay más de un partido con el máximo de votos, retornar un error
            if ($winningParties->count() > 1) {
                DB::rollBack();
                return $this->redirectWithMessage('error', 'Hay varios partidos con la misma cantidad de votos.');
            }

            // Seleccionar el partido ganador
            $winningParty = $winningParties->first();

            // Marcar el partido como ganador
            $winningParty->update(['iswinner' => true]);

            // Descartar todos los demás partidos
            Party::where('discarded', false)
                ->where('id', '!=', $winningParty->id)
                ->update(['discarded' => true]);

            // Confirmar la transacción
            DB::commit();
            $winningParty->votes_count = $winningParty->votes()->where('discarded', false)->count();
            event(new PartyCast($winningParty));
            // Retornar un mensaje de éxito
            return $this->redirectWithMessage('success', 'Se ha elegido el partido ganador correctamente.');
        } catch (\Exception $e) {
            // Revertir la transacción en caso de error
            DB::rollBack();
            Log::error('Error al seleccionar el partido ganador: ' . $e->getMessage());
            return $this->redirectWithMessage('error', 'Ocurrió un error al seleccionar el partido ganador.');
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
