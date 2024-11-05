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
            $image = $request->file('image')->storeAs('img', $name,'public');
            $party->image = '/img/' . $name;
            $party->save();
        }
        return to_route('dashboard');
    }
}
