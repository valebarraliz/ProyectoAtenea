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
        $users = $this->getUsers();
        return Inertia::render('Admin/ManageUsers', compact('users'));
    }

    public function store(Request $request)
    {
        // Validación de la carga del archivo
        $request->validate([
            'file' => ['required', 'file'],
        ]);

        $file = $request->file('file');
        $fileContents = file($file->getPathname());
        $header = str_getcsv(array_shift($fileContents));

        // Validar que las columnas requeridas existan en el archivo CSV
        $nameIndex = array_search('nombre', $header);
        $cedulaIndex = array_search('cedula', $header);

        if ($nameIndex === false || $cedulaIndex === false) {
            return $this->redirectWithError('El archivo CSV debe contener las columnas "nombre" y "cedula".');
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
            return $this->redirectWithError($e->getMessage());
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
                'password' => Hash::make($citizenNumber),
            ]);
        }
    }

    /**
     * Obtiene los usuarios activos que no tienen rol de administrador.
     */
    public function getUsers()
    {
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
            $user = User::findOrFail($request->id);
            $user->update(['force_password_reset' => true]);

            return to_route('users')->with('success', "El usuario {$user->name} ha sido recuperado.")->with('success_timestamp', now()->timestamp);
        } catch (\Exception $e) {
            return $this->redirectWithError('Hubo un error al intentar recuperar el usuario.');
        }
    }

    public function discardUsers()
    {
        User::query()
            ->where('discarded', '!=', true)
            ->where('role_id', '!=', 1)
            ->update(['discarded' => true]);

        return to_route('database')->with('success', 'Se han descartado los usuarios.')->with('success_timestamp', now()->timestamp);
    }

    /**
     * Redirige con un mensaje de error.
     *
     * @param string $message
     * @return \Illuminate\Http\RedirectResponse
     */
    private function redirectWithError(string $message)
    {
        return redirect()->back()
            ->with('error', $message)
            ->with('error_timestamp', now()->timestamp);
    }
}
