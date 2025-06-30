<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SetorSampah extends Model
{
    use HasFactory;

    protected $fillable = [
        'jenis_sampah',
        'berat_sampah',
        'total_harga',
        'point',
        'cabang',
        'foto_sampah',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}