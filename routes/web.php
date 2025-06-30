<?php

use App\Http\Controllers\LaporSampahController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SetorSampahController;
use App\Http\Controllers\RedeemController; // Tambahkan ini!
use App\Models\LaporSampah;
use App\Models\SetorSampah;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/lapor-sampah', [LaporSampahController::class, 'index'])->middleware(['auth', 'verified'])->name('lapor-sampah');
Route::post('/lapor-sampah/store', [LaporSampahController::class, 'store'])->middleware(['auth', 'verified'])->name('lapor-sampah.store');

Route::get('/setor-sampah', [SetorSampahController::class, 'index'])->middleware(['auth', 'verified'])->name('setor-sampah');
Route::post('/setor-sampah/store', [SetorSampahController::class, 'store'])->middleware(['auth', 'verified'])->name('setor-sampah.store');

Route::get('/insentif', function () {
    $userId = Auth::id();
    $totalPoints = Auth::user()->total_points;
    return Inertia::render('Insentif', [
        'totalPoints' => $totalPoints
    ]);
})->middleware(['auth', 'verified'])->name('insentif');

// --- Tambahkan Route ini untuk menyimpan alamat penukaran ---
Route::post('/redeem-address', [RedeemController::class, 'saveAddress'])
    ->middleware(['auth', 'verified'])
    ->name('redeem.address');
// -------------------------------------------------------------

// --- Tambahkan Route ini untuk penukaran item ---
Route::post('/redeem-item', [RedeemController::class, 'redeem'])
    ->middleware(['auth', 'verified'])
    ->name('redeem.item');
// -------------------------------------------------

Route::get('/feedback', function () {
    return Inertia::render('Feedback');
})->middleware(['auth', 'verified'])->name('feedback');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';