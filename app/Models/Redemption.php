<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Redemption extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'item_id',
        'address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
