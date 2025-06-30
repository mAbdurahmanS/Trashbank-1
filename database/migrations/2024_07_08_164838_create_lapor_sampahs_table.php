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
        Schema::create('lapor_sampahs', function (Blueprint $table) {
            $table->id();
            $table->integer("user_id");
            $table->string("jenis_sampah");
            $table->string("foto_sampah");
            $table->bigInteger("berat_sampah");
            $table->bigInteger("total_harga");
            $table->bigInteger("point");
            $table->decimal("latitude", 10, 7);
            $table->decimal("longitude", 10, 7);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lapor_sampahs');
    }
};