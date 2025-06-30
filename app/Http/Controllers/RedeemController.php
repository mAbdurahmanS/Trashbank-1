<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User; // Pastikan ini mengarah ke model User kamu
use App\Models\Redemption; // Jika kamu ingin menyimpan riwayat penukaran

class RedeemController extends Controller
{
    /**
     * Handle the item redemption request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function redeem(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'item_id' => 'required|integer',
            'points_cost' => 'required|integer|min:0',
        ]);

        $user = $request->user(); // Mendapatkan pengguna yang sedang login

        // 2. Ambil Informasi Item dari Database (Disarankan!) atau hardcode (Sementara)
        // JANGAN HANYA PERCAYA DATA DARI FRONTEND UNTUK HARGA POIN!
        // Ambil item dari database berdasarkan item_id
        // Contoh: $item = Item::find($request->item_id);
        // if (!$item) {
        //     return back()->withErrors(['message' => 'Item tidak ditemukan.']);
        // }
        // $pointsToDeduct = $item->point; // Ambil biaya poin dari database item
        // $itemName = $item->title;

        // Untuk sementara (jika belum ada tabel item), gunakan array hardcode seperti ini:
        $cardsData = [
            ['id' => 1, 'title' => 'Gas LPG 3 kg', 'point' => 6],
            ['id' => 2, 'title' => 'Minyak 1 liter', 'point' => 3],
            ['id' => 3, 'title' => 'Beras 10 kg', 'point' => 10],
            ['id' => 4, 'title' => 'Indomie 1 dus', 'point' => 8],
            ['id' => 5, 'title' => 'Telor 1 kg', 'point' => 5],
            ['id' => 6, 'title' => 'Kecap 500 ml', 'point' => 2],
            ['id' => 7, 'title' => 'Gula 1kg', 'point' => 2],
            ['id' => 8, 'title' => 'Kompor', 'point' => 20],
            ['id' => 9, 'title' => 'Motor', 'point' => 100],
        ];

        $selectedItemBackend = collect($cardsData)->firstWhere('id', $request->item_id);

        if (!$selectedItemBackend) {
            return back()->withErrors(['message' => 'Item tidak ditemukan di server.']);
        }

        // Gunakan biaya poin dari data yang valid di backend, bukan dari frontend
        $pointsToDeduct = $selectedItemBackend['point'];
        $itemName = $selectedItemBackend['title'];

        // 3. Cek Poin Pengguna
        // Debug log untuk pengecekan error 422
        \Log::info('REDEEM DEBUG', [
            'user_id' => $user->id,
            'user_total_points' => $user->total_points,
            'pointsToDeduct' => $pointsToDeduct,
            'item_id' => $request->item_id,
            'cardsData_ids' => collect($cardsData)->pluck('id')->all(),
        ]);
        if ($user->total_points < $pointsToDeduct) {
            if ($request->expectsJson() || $request->wantsJson() || $request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Poin Anda tidak cukup untuk menukar item ini.',
                    'total_points' => $user->total_points,
                ], 422);
            }
            return back()->withErrors(['message' => 'Poin Anda tidak cukup untuk menukar item ini.']);
        }

        // 4. Lakukan Pengurangan Poin (INI BAGIAN UTAMANYA!)
        $user = \App\Models\User::find($user->id); // pastikan ambil user dari database
        $user->total_points -= $pointsToDeduct;
        $user->save(); // **PENTING: Menyimpan perubahan ke database**

        // 5. Simpan Riwayat Penukaran (Opsional, tapi Sangat Direkomendasikan!)
        /*
        // Contoh jika kamu memiliki model Redemption
        Redemption::create([
            'user_id' => $user->id,
            'item_id' => $request->item_id, // Atau $item->id jika pakai model Item
            'points_used' => $pointsToDeduct,
            'redemption_date' => now(),
            // Tambahkan kolom lain yang relevan (misalnya status pengiriman)
        ]);
        */

        // 6. Beri Respons Sukses dan Alihkan Kembali
        if ($request->expectsJson() || $request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Berhasil menukar ' . $itemName . '!',
                'total_points' => $user->total_points,
            ]);
        }
        return redirect()->back()->with('success', 'Berhasil menukar ' . $itemName . '!');
    }

    /**
     * Menerima dan menyimpan alamat penerima hadiah ke tabel redemptions
     */
    public function saveAddress(Request $request)
    {
        $request->validate([
            'item_id' => 'required|integer',
            'address' => 'required|string|max:255',
        ]);

        $user = $request->user();

        // Simpan alamat ke tabel redemptions
        $redemption = Redemption::create([
            'user_id' => $user->id,
            'item_id' => $request->item_id,
            'address' => $request->address,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Alamat berhasil disimpan.',
            'redemption' => $redemption,
        ]);
    }
}