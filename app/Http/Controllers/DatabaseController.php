<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Party;
use App\Models\Vote;
use Illuminate\Support\Facades\Log;

class DatabaseController extends Controller
{
    /**
     * Muestra la vista para gestionar la base de datos.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Admin/ManageDatabase');
    }

    /**
     * Elimina usuarios, votos y partidos, excepto los administradores.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function delete()
    {
        try {
            // Eliminar usuarios que no son administradores
            User::where('role_id', '!=', 1)->delete();

            // Eliminar votos
            Vote::query()->delete();

            // Eliminar partidos
            Party::query()->delete();

            // Mensaje de éxito
            return redirect()->back()->with('success', 'Base de datos eliminada correctamente.');
        } catch (\Exception $e) {
            // Registrar el error
            Log::error('Error al eliminar la base de datos: ' . $e->getMessage());

            // Mensaje de error
            return redirect()->back()->with('error', 'Ocurrió un error al intentar eliminar la base de datos.');
        }
    }
}
