<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\PartyController;
use App\Http\Controllers\ProfileController;


Route::get('/', [VoteController::class,'index'])->name('welcome');

Route::get('/dashboard', [RoleController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::post('/party', [PartyController::class, 'store'])->name('party.store');
Route::post('/user', [UserController::class, 'store'])->name('user.store');
Route::middleware('auth')->group(function () {
    Route::post('/vote', [VoteController::class,'store'])->name('vote.store');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});
Route::get('/token', function () {
    return csrf_token(); 
});
require __DIR__ . '/auth.php';
