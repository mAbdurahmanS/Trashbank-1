<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('setor_sampahs', function (Blueprint $table) {
            $table->id();
            $table->integer("user_id");
            $table->string("jenis_sampah");
            $table->string("cabang");
            $table->string("foto_sampah");
            $table->bigInteger("berat_sampah");
            $table->bigInteger("total_harga");
            $table->bigInteger("point");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('setor_sampahs');
    }
};