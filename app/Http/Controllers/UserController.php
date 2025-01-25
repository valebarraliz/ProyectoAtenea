<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ManageUsers');
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file'],
        ]);

        $file = $request->file('file');
        $fileContents = file($file->getPathname());
        $header = str_getcsv(array_shift($fileContents));
        $nameIndex = array_search('nombre', $header);
        $cedulaIndex = array_search('cedula', $header);

        DB::beginTransaction();

        try {
            foreach ($fileContents as $line) {
                $data = str_getcsv($line);
                try {
                    User::create([
                        'name' => $data[$nameIndex],
                        'citizen_number' => $data[$cedulaIndex],
                        'password' => Hash::make($data[$cedulaIndex])
                    ]);
                } catch (\Illuminate\Database\QueryException $e) {
                    if ($e->getCode() == 23000) {
                        throw new \Exception("El usuario con cédula " . $data[$cedulaIndex] . " ya está registrado.");
                    } else {
                        throw $e;
                    }
                }
            }

            DB::commit();

            return to_route('users')->with('success', 'Archivo importado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['file' => 'Error al importar el archivo: ' . $e->getMessage()]);
        }
    }
}
