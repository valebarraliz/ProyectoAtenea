<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\PartyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DatabaseController;


Route::get('/', [VoteController::class, 'index'])->name('welcome');
Route::get('/party-get', [PartyController::class, 'getWinningParty'])->name('party.get');

Route::middleware(['auth', 'verified', 'discarded'])->group(function () {
    Route::middleware(['admin'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users');
        Route::get('/database', [DatabaseController::class, 'index'])->name('database');
        Route::get('/databaseDelete', [DatabaseController::class, 'delete'])->name('database.delete');
        Route::get('/discardVotes', [VoteController::class, 'discardVotes'])->name('vote.discard');
        Route::get('/discardUsers', [UserController::class, 'discardUsers'])->name('user.discard');
        Route::get('/discardParties', [PartyController::class, 'discardParties'])->name('party.discard');
        Route::post('/party-store', [PartyController::class, 'store'])->name('party.store');
        Route::post('/party-update', [PartyController::class, 'update'])->name('party.update');
        Route::get('/party-select', [PartyController::class, 'selectWinningParty'])->name('party.select');
        Route::put('/party-discard', [PartyController::class, 'discardPartyById'])->name('party.discard');
        Route::put('/party-recover', [PartyController::class, 'recoverPartyById'])->name('party.recover');
        Route::post('/user', [UserController::class, 'store'])->name('user.store');
        Route::get('/getusers', [UserController::class, 'getUsers'])->name('user.get');
        Route::put('/recoveruser', [UserController::class, 'recoverUser'])->name('user.recover');
    });
    Route::post('/vote', [VoteController::class, 'store'])->name('vote.store');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/dashboard', [RoleController::class, 'index'])->name('dashboard');
});
Route::get('/token', function () {
    return csrf_token();
});
require __DIR__ . '/auth.php';
