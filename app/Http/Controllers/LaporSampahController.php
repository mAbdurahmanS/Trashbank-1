<?php

namespace App\Http\Controllers;

use App\Models\LaporSampah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;


class LaporSampahController extends Controller
{
    public function index()
    {
        $laporSampahData = LaporSampah::all()->map(function ($laporan) {
            return [
                'id' => $laporan->id,
                'nama' => $laporan->user->name, // Asumsi user terkait sudah terhubung
                'jenis_sampah' => $laporan->jenis_sampah,
                'berat_sampah' => $laporan->berat_sampah,
                'total_harga' => $laporan->total_harga,
                'point' => $laporan->point,
                'latitude' => $laporan->latitude,
                'longitude' => $laporan->longitude,
                'foto_sampah' => $laporan->foto_sampah,
                'createdAt' => $laporan->created_at->format('Y-m-d H:i:s'),
            ];
        });

        return Inertia::render('LaporSampah', [
            'database' => $laporSampahData,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'foto_sampah' => 'required|image|max:2048',
            'jenis_sampah' => 'required|string',
            'berat_sampah' => 'required|numeric',
            'total_harga' => 'required|numeric',
            'point' => 'required|numeric',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);


        if ($request->hasFile('foto_sampah')) {
            $imageName = Str::random(20) . '.' . $request->file('foto_sampah')->getClientOriginalExtension();
            $imagePath = $request->file('foto_sampah')->move(public_path(), $imageName);
        }

        LaporSampah::create([
            'user_id' => Auth::user()->id,
            'jenis_sampah' => $validatedData['jenis_sampah'],
            'foto_sampah' => $imageName,
            'berat_sampah' => $validatedData['berat_sampah'],
            'total_harga' => $validatedData['total_harga'],
            'point' => $validatedData['point'],
            'latitude' => $validatedData['latitude'],
            'longitude' => $validatedData['longitude'],
        ]);

        // Tambah point ke user
        $user = \App\Models\User::find(Auth::id());
        $user->total_points += $validatedData['point'];
        $user->save();

        return redirect()->back()->with('success', 'Laporan berhasil ditambahkan!');
    }
}