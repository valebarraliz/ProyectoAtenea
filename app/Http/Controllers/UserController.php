<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Muestra la vista de gestión de usuarios.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $users = $this->getUsers();
        return Inertia::render('Admin/ManageUsers', compact('users'));
    }

    /**
     * Importa usuarios desde un archivo CSV.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
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
            return $this->redirectWithMessage('error', 'El archivo CSV debe contener las columnas "nombre" y "cedula".');
        }

        DB::beginTransaction();

        try {
            foreach ($fileContents as $line) {
                $data = str_getcsv($line);
                $this->createOrUpdateUser($data[$nameIndex], $data[$cedulaIndex]);
            }

            DB::commit();
            return $this->redirectWithMessage('success', 'Archivo importado exitosamente.');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->redirectWithMessage('error', 'Ocurrió un error al importar el archivo: ' . $e->getMessage());
        }
    }

    /**
     * Crea un nuevo usuario o reactiva uno descartado si ya existe.
     *
     * @param string $name
     * @param string $citizenNumber
     * @throws \Exception
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
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUsers()
    {
        return User::where('discarded', '!=', true)
            ->where('role_id', '!=', 1)
            ->get();
    }

    /**
     * Recupera un usuario descartado.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function recoverUser(Request $request)
    {
        $request->validate([
            'id' => ['required', 'integer'],
        ]);

        try {
            $user = User::findOrFail($request->id);
            $user->update(['force_password_reset' => true]);

            return $this->redirectWithMessage('success', "El usuario {$user->name} ha sido recuperado.");
        } catch (\Exception $e) {
            return $this->redirectWithMessage('error', 'Hubo un error al intentar recuperar el usuario.');
        }
    }

    /**
     * Descarta todos los usuarios no descartados (excepto administradores).
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function discardUsers()
    {
        try {
            User::query()
                ->where('discarded', '!=', true)
                ->where('role_id', '!=', 1)
                ->update(['discarded' => true]);

            return $this->redirectWithMessage('success', 'Se han descartado los usuarios.');
        } catch (\Exception $e) {
            return $this->redirectWithMessage('error', 'Ocurrió un error al descartar los usuarios.');
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
