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
        return Inertia::render('Admin/ManageUsers', ['users' => $this->getUsers()]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => ['required', 'file'],
        ], [
            'file.required' => 'Es obligatorio subir un archivo'
        ]);

        $file = $request->file('file');
        $fileContents = file($file->getPathname());
        $header = str_getcsv(array_shift($fileContents));

        // Validar que las columnas requeridas existan en el archivo CSV
        $nameIndex = array_search('nombre', $header);
        $cedulaIndex = array_search('cedula', $header);

        if ($nameIndex === false || $cedulaIndex === false) {
            return redirect()->back()
                ->with('error', 'El archivo CSV debe contener las columnas "nombre" y "cedula".')
                ->with('error_timestamp', now()->timestamp);
        }

        DB::beginTransaction();

        try {
            foreach ($fileContents as $line) {
                $data = str_getcsv($line);
                $this->createOrUpdateUser($data[$nameIndex], $data[$cedulaIndex]);
            }

            DB::commit();
            return to_route('users')->with('success', 'Archivo importado exitosamente.')->with('success_timestamp', now()->timestamp);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', $e->getMessage())
                ->with('error_timestamp', now()->timestamp);
        }
    }

    /**
     * Crea un nuevo usuario o reactiva uno descartado si ya existe.
     */
    private function createOrUpdateUser(string $name, string $citizenNumber)
    {
        $user = User::where('citizen_number', $citizenNumber)->first();

        if ($user) {
            if ($user->discarded) {
                $user->update(['discarded' => false]);
            } else {
                throw new \Exception("El usuario con cédula $citizenNumber ya está registrado.");
            }
        } else {
            User::create([
                'name' => $name,
                'citizen_number' => $citizenNumber,
                'password' => Hash::make($citizenNumber)
            ]);
        }
    }

    public function getUsers()
    {
        // Obtén los usuarios de la base de datos
        return User::where('discarded', '!=', true)
            ->where('role_id', '!=', 1)
            ->get(); // Respuesta como array
    }

    public function recoverUser(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer'],
        ]);
        try {

            $user = User::find($request->id);
            $user->update(['force_password_reset' => true]);

            return to_route('users')->with('success', 'El usuario ' . $user->name . ' ha sido recuperado.')->with('success_timestamp', now()->timestamp);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', $e->getMessage())
                ->with('error_timestamp', now()->timestamp);
        }
    }

    public function discardUsers()
    {
        User::query()->where('discarded', '!=', true)->where('role_id', '!=', 1)
            ->update(['discarded' => true]);
        return to_route('database')->with('success', 'Se han descartado los usuarios.')->with('success_timestamp', now()->timestamp);
    }
}
