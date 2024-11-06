<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file'],
        ]);

        $file = $request->file('file');
        $fileContents = file($file->getPathname());

        // Leer la primera fila para obtener el encabezado y determinar las posiciones de cada columna
        $header = str_getcsv(array_shift($fileContents));
        $nameIndex = array_search('nombre', $header);
        $cedulaIndex = array_search('cedula', $header);

        // Iniciar la transacción
        DB::beginTransaction();

        try {
            foreach ($fileContents as $line) {
                $data = str_getcsv($line);

                User::create([
                    'name' => $data[$nameIndex],
                    'citizen_number' => $data[$cedulaIndex],
                    'password' => Hash::make($data[$cedulaIndex])
                ]);
            }

            // Confirmar la transacción
            DB::commit();

            return to_route('dashboard')->with('success', 'Archivo importado exitosamente.');
        } catch (\Exception $e) {
            // Revertir la transacción en caso de error
            DB::rollBack();

            return back()->withErrors(['file' => 'Error al importar el archivo: ' . $e->getMessage()]);
        }
    }
   
}
