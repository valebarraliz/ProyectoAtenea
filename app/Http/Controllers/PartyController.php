<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Party;

class PartyController extends Controller
{
    public function index() {}
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'image' => ['required', 'image'],
        ]);
        $party = Party::create($request->all());
        if ($request->hasFile('image')) {
            $name = $party->id . '.' . $request->file('image')->getClientOriginalName();
            $image = $request->file('image')->storeAs('img', $name, 'public');
            $party->image = '/img/' . $name;
            $party->save();
        }
        return to_route('dashboard');
    }
    public function update(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer'],
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'image' => ['required', 'image'],
        ]);
        $party = Party::findOrFail($request->id);
        $party->update(['name' => $request->name, 'description' => $request->description]);
        if ($request->hasFile('image')) {
            unlink(public_path() . '/storage' . $party->image);
            $name = $party->id . '.' . $request->file('image')->getClientOriginalName();
            $image = $request->file('image')->storeAs('img', $name, 'public');
            $party->image = '/img/' . $name;
            $party->save();
        }
        return to_route('dashboard');
    }
    public function discardPartyById(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer'],
        ]);
        $party = Party::find($request->id);
        $party->update(['discarded' => true]);

        return to_route('dashboard')->with('success', 'Se ha descartado el partido ' . $party->name)->with('success_timestamp', now()->timestamp);;
    }
    public function recoverPartyById(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer'],
        ]);
        $party = Party::find($request->id);
        $party->update(['discarded' => false]);

        return to_route('dashboard')->with('success', 'Se ha recuperado el partido ' . $party->name)->with('success_timestamp', now()->timestamp);;
    }
    public function discardParties()
    {
        Party::query()->where('discarded', '!=', true)
            ->update(['discarded' => true]);
        return to_route('database')->with('success', 'Se han descartado los partidos.')->with('success_timestamp', now()->timestamp);
    }
    public function deletePartyById(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer'],
        ]);
        $party = Party::find($request->id);
        $party->delete();
        return to_route('dashboard')->with('success', 'Se ha eliminado el partido ' . $party->name)->with('success_timestamp', now()->timestamp);;
    }
    public function getWinningParties(){
        return Party::where('iswinner','!=',false)->get();
    }
    public function selectWinningParty(Request $request)
{
    // Validación del request
    $request->validate([
        'id' => ['required', 'integer'],
    ]);

    // Obtener todos los partidos no descartados
    $parties = Party::where('discarded', false)->get();

    // Verificar si hay más de un partido con la misma cantidad de votos
    $maxVotes = $parties->max('votes');  // Asumiendo que 'votes' es el campo de los votos
    $winningParties = $parties->filter(function ($party) use ($maxVotes) {
        return $party->votes === $maxVotes;
    });

    // Si hay más de un partido con la misma cantidad de votos, enviar error
    if ($winningParties->count() > 1) {
        return redirect()->back()->with('error', 'Hay varios partidos con la misma cantidad de votos.')
            ->with('error_timestamp', now()->timestamp);
    }

    // Si hay un solo partido con el mayor número de votos, marcarlo como ganador
    $winningParty = $winningParties->first();
    $winningParty->update(['iswinner' => true]);

    // Redirigir con mensaje de éxito
    return redirect()->back()->with('success', 'Se ha elegido el partido ganador')
        ->with('success_timestamp', now()->timestamp);
}

}
